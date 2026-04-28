type ApiError = Error & { status?: number; code?: string; details?: unknown };

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000";

export function getAuthToken() {
  try {
    return localStorage.getItem("royalorchard-token") || "";
  } catch {
    return "";
  }
}

export function setAuthToken(token: string) {
  try {
    if (token) localStorage.setItem("royalorchard-token", token);
    else localStorage.removeItem("royalorchard-token");
  } catch {
    // ignore
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

export async function api<T>(path: string, opts: RequestInit & { auth?: boolean } = {}): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers(opts.headers || {});

  if (!headers.has("content-type") && opts.body && !(opts.body instanceof FormData)) {
    headers.set("content-type", "application/json");
  }

  if (opts.auth) {
    const token = getAuthToken();
    if (token) headers.set("authorization", `Bearer ${token}`);
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

