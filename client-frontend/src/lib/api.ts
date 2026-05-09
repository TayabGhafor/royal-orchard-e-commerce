type ApiError = Error & { status?: number; code?: string; details?: unknown };

const envApi = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
/** Dev: same-origin `/api` via Vite. Prod: set `VITE_API_URL` or rely on same-host `/api` + rewrites. */
const API_URL =
  envApi !== undefined && envApi !== ""
    ? envApi
    : import.meta.env.DEV
      ? ""
      : "";

const TOKEN_KEY = "royalorchard-token";

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
  const url = apiUrl(path);
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

