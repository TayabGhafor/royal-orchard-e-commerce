type ApiError = Error & { status?: number; code?: string; details?: unknown };

const envApi = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
/** In dev, default to same-origin so Vite can proxy /api (fixes CORS + localhost vs 127.0.0.1). */
const API_URL =
  envApi !== undefined && envApi !== ""
    ? envApi
    : import.meta.env.DEV
      ? ""
      : "http://localhost:5000";

const TOKEN_KEY = "royalorchard-token";

export function getAuthToken() {
  try {
    // Prefer persistent login (localStorage), fall back to session-only login.
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAuthToken(token: string, mode: "local" | "session" = "local") {
  try {
    if (token) {
      if (mode === "local") {
        localStorage.setItem(TOKEN_KEY, token);
        sessionStorage.removeItem(TOKEN_KEY);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
      }
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
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

