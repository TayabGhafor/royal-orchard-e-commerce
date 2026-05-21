import { api, resolvedOriginForAssets } from "@/lib/api";

export type BlogSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  author: string;
  tags: string[];
  readTimeMinutes: number;
  publishedAt?: string;
};

export type BlogPost = BlogSummary & {
  content: string;
};

export function blogThumbSrc(thumbnail: string) {
  if (!thumbnail) return "";
  if (thumbnail.startsWith("http") || thumbnail.startsWith("/")) return thumbnail;
  const origin = resolvedOriginForAssets();
  return `${origin}/api/uploads/image/${thumbnail}`;
}

export async function fetchPublishedBlogs() {
  return api<{ items: BlogSummary[] }>("/api/blogs");
}

export async function fetchBlogBySlug(slug: string) {
  return api<{ blog: BlogPost }>(`/api/blogs/${encodeURIComponent(slug)}`);
}
