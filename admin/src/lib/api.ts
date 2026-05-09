type ApiError = Error & { status?: number; code?: string; details?: unknown };

const envApi = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_URL =
  envApi !== undefined && envApi !== ""
    ? envApi
    : import.meta.env.DEV
      ? ""
      : "http://localhost:5000";
const ADMIN_KEY = (import.meta.env.VITE_ADMIN_API_KEY as string | undefined) || "dev-admin-key";

/**
 * When VITE_API_URL is set to `https://host.../api`, paths already start with `/api/...`.
 * Joining naively would produce `/api/api/...` and the server returns 404 "Route not found".
 */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!API_URL) return p;
  let base = API_URL.replace(/\/+$/, "");
  if (p.startsWith("/api/") && /\/api$/i.test(base)) {
    base = base.replace(/\/api$/i, "");
  }
  return `${base}${p}`;
}

/** Origin to prefix relative asset URLs like `/api/uploads/image/:id` (no duplicate `/api`). */
export function resolvedOriginForAssets(): string {
  if (!API_URL) return "";
  return API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");
}

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function api<T>(
  path: string,
  opts: RequestInit & { admin?: boolean } = {},
): Promise<T> {
  const url = apiUrl(path);
  const headers = new Headers(opts.headers || {});
  if (!headers.has("content-type") && opts.body && !(opts.body instanceof FormData)) {
    headers.set("content-type", "application/json");
  }
  if (opts.admin) {
    headers.set("x-admin-key", ADMIN_KEY);
  }

  const res = await fetch(url, { ...opts, headers, credentials: "include" });
  if (!res.ok) {
    const body = await parseJsonSafe(res);
    const err: ApiError = new Error(body?.error?.message || `Request failed (${res.status})`) as ApiError;
    err.status = res.status;
    err.code = body?.error?.code;
    err.details = body;
    throw err;
  }
  return (await parseJsonSafe(res)) as T;
}

/** Single GridFS-backed image upload; field name must be `image`. */
export async function uploadProductImage(file: File) {
  const fd = new FormData();
  fd.append("image", file);
  return api<{ imageId: string; imageUrl: string }>("/api/uploads/image", {
    method: "POST",
    body: fd,
    admin: true,
  });
}

