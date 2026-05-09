export type ProductImage = { fileId: string; url: string };

const envApi = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
export const IMAGE_API_BASE =
  envApi !== undefined && envApi !== ""
    ? envApi
    : import.meta.env.DEV
      ? ""
      : "http://localhost:5000";

export function normalizeImagesFromRaw(raw: unknown): ProductImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === "string") {
        const url = entry.trim();
        return url ? urlToEntry(url) : null;
      }
      if (entry && typeof entry === "object" && "url" in entry) {
        const url = String((entry as { url: unknown }).url || "").trim();
        if (!url) return null;
        const fileId = String((entry as { fileId?: unknown }).fileId || "").trim();
        return { fileId, url };
      }
      return null;
    })
    .filter(Boolean) as ProductImage[];
}

export function urlToEntry(url: string): ProductImage {
  const u = url.trim();
  const m = u.match(/\/api\/uploads\/image\/([a-f\d]{24})\/?(?:[?#].*)?$/i);
  const id = m ? m[1] : "";
  return { fileId: id, url: u };
}

export function displayUrlForProductImage(entry: ProductImage | string | undefined | null): string {
  if (entry == null) return "";
  const url = typeof entry === "string" ? entry.trim() : String(entry.url || "").trim();
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${IMAGE_API_BASE}${url}`;
  return `${IMAGE_API_BASE}/${url}`;
}

export function parseUrlLinesToEntries(text: string): ProductImage[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map(urlToEntry);
}
