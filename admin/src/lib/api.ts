type ApiError = Error & { status?: number; code?: string; details?: unknown };

const envApi = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
/**
 * - Dev: same-origin `/api` via Vite proxy.
 * - Prod: set `VITE_API_URL` to your API origin (e.g. `https://x.onrender.com`), **without** a trailing `/api`
 *   unless you intentionally use a sub-path (rare). Using `http://localhost:5000` in deployed builds
 *   points browsers at the visitor's own machine and breaks uploads (`Route not found` is a common symptom).
 */
const API_URL =
  envApi !== undefined && envApi !== ""
    ? envApi
    : import.meta.env.DEV
      ? ""
      : "";
const ADMIN_KEY = (import.meta.env.VITE_ADMIN_API_KEY as string | undefined) || "dev-admin-key";

/**
 * When `VITE_API_URL` ends with `/api` and paths start with `/api/...`, avoid `/api/api/...` (404).
 */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!API_URL) return p;
  const raw = API_URL.trim().replace(/\/+$/, "");
  try {
    const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withScheme);
    let prefix = (u.pathname || "").replace(/\/+$/, "");
    if (p.startsWith("/api/") && /\/api$/i.test(prefix)) {
      prefix = prefix.replace(/\/api$/i, "");
    }
    return `${u.origin}${prefix}${p}`;
  } catch {
    let base = raw;
    if (p.startsWith("/api/") && /\/api$/i.test(base)) base = base.replace(/\/api$/i, "");
    return `${base}${p}`;
  }
}

/** Origin for prefixing `/api/uploads/image/:id` in `<img src>` (no duplicated `/api`). */
export function resolvedOriginForAssets(): string {
  if (!API_URL) return "";
  const raw = API_URL.trim().replace(/\/+$/, "");
  try {
    const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withScheme);
    let prefix = (u.pathname || "").replace(/\/+$/, "");
    if (/\/api$/i.test(prefix)) prefix = prefix.replace(/\/api$/i, "");
    return `${u.origin}${prefix}`;
  } catch {
    return raw.replace(/\/api$/i, "");
  }
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
  const paths = ["/api/uploads/image", "/uploads/image"];
  let last: unknown;
  for (const path of paths) {
    try {
      const fd = new FormData();
      fd.append("image", file);
      return await api<{ imageId: string; imageUrl: string }>(path, {
        method: "POST",
        body: fd,
        admin: true,
      });
    } catch (e) {
      last = e;
      const err = e as ApiError;
      const is404 = err?.status === 404 || err?.code === "not_found";
      if (!is404) throw e;
    }
  }
  throw last instanceof Error ? last : new Error("Image upload failed");
}

