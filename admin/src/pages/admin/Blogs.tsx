import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Icon } from "@/components/Icon";
import { api, uploadProductImage, resolvedOriginForAssets } from "@/lib/api";
import BlogRichEditor from "@/components/admin/BlogRichEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TableSkeleton } from "@/components/admin/AdminSkeletons";

type BlogItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  author: string;
  tags: string[];
  readTimeMinutes: number;
  status: "draft" | "published";
  publishedAt?: string;
  isSeedData?: boolean;
};

function thumbSrc(thumbnail: string) {
  if (!thumbnail) return "";
  if (thumbnail.startsWith("http") || thumbnail.startsWith("/")) return thumbnail;
  const origin = resolvedOriginForAssets();
  return `${origin}/api/uploads/image/${thumbnail}`;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const Blogs = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<BlogItem[]>([]);
  const [editing, setEditing] = useState<BlogItem | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [author, setAuthor] = useState("Royal Orchard Editorial");
  const [tags, setTags] = useState("");
  const [publishedAt, setPublishedAt] = useState(todayIso());
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ items: BlogItem[] }>("/api/blogs/admin/all", { admin: true });
      setItems(res.items || []);
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setThumbnail("");
    setAuthor("Royal Orchard Editorial");
    setTags("");
    setPublishedAt(todayIso());
    setThumbFile(null);
  };

  const startEdit = (blog: BlogItem) => {
    setEditing(blog);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setThumbnail(blog.thumbnail);
    setAuthor(blog.author);
    setTags((blog.tags || []).join(", "));
    setPublishedAt(
      blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 10) : todayIso(),
    );
    setThumbFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadThumb = async () => {
    if (!thumbFile) return thumbnail;
    const { imageId, imageUrl } = await uploadProductImage(thumbFile);
    return imageUrl || imageId || thumbnail;
  };

  const saveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setBusy(true);
    try {
      const thumb = await uploadThumb();
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        thumbnail: thumb,
        author: author.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
        status: "draft",
      };
      if (editing) {
        await api(`/api/blogs/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
          admin: true,
        });
        toast.success("Draft saved");
      } else {
        await api("/api/blogs", { method: "POST", body: JSON.stringify(payload), admin: true });
        toast.success("Draft created");
      }
      resetForm();
      await load();
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setBusy(true);
    try {
      const thumb = await uploadThumb();
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        thumbnail: thumb,
        author: author.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
        status: "published",
      };
      if (editing) {
        await api(`/api/blogs/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
          admin: true,
        });
      } else {
        await api("/api/blogs", { method: "POST", body: JSON.stringify(payload), admin: true });
      }
      toast.success("Published — live on the blog page");
      resetForm();
      await load();
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Publish failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this blog post?")) return;
    setBusy(true);
    try {
      await api(`/api/blogs/${id}`, { method: "DELETE", admin: true });
      toast.success("Deleted");
      if (editing?._id === id) resetForm();
      await load();
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const previewThumb = thumbFile ? URL.createObjectURL(thumbFile) : thumbSrc(thumbnail);

  return (
    <AdminLayout>
      <div className="p-8 lg:p-12 space-y-10 max-w-5xl">
        <header>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 font-headline">
            {editing ? "Edit Blog" : "Add Blog"}
          </h2>
          <p className="text-stone-500 mt-1">
            Craft editorial stories, upload a thumbnail, and publish to the storefront blog.
          </p>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input
                id="blog-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Art of Ripening…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-date">Posted date</Label>
              <Input
                id="blog-date"
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
              <p className="text-xs text-stone-400">Defaults to today; adjust before publishing.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="blog-author">Author</Label>
              <Input id="blog-author" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
              <Input
                id="blog-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Sindhri, Harvest, Recipes"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-excerpt">Excerpt</Label>
            <Textarea
              id="blog-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Short preview for the blog listing…"
            />
          </div>

          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div className="flex flex-wrap items-start gap-4">
              {previewThumb && (
                <img
                  src={previewThumb}
                  alt=""
                  className="w-32 h-32 object-cover rounded-xl border border-stone-200"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                className="max-w-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <BlogRichEditor value={content} onChange={setContent} placeholder="Write your editorial story…" />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" variant="outline" onClick={saveDraft} disabled={busy}>
              Save draft
            </Button>
            <Button
              type="button"
              onClick={publish}
              disabled={busy}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Icon name="publish" className="text-base mr-1" />
              Publish to blog
            </Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={resetForm} disabled={busy}>
                Cancel edit
              </Button>
            )}
          </div>
        </motion.section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold font-headline text-stone-900">All posts</h3>
          {loading ? (
            <TableSkeleton rows={4} cols={4} />
          ) : items.length === 0 ? (
            <p className="text-stone-400 text-sm">No blogs yet.</p>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {items.map((b) => (
                    <tr key={b._id} className="hover:bg-stone-50/60">
                      <td className="px-6 py-4 font-semibold text-stone-900">
                        {b.title}
                        {b.isSeedData && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            Seed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            b.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-500">
                        {b.publishedAt
                          ? new Date(b.publishedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(b)}
                          className="text-orange-600 font-bold text-xs hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(b._id)}
                          className="text-rose-600 font-bold text-xs hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default Blogs;
