import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Icon } from "@/components/Icon";
import { api } from "@/lib/api";
import { TableSkeleton } from "@/components/admin/AdminSkeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type KnowledgeItem = {
  _id: string;
  title: string;
  content: string;
  type: "text" | "pdf" | "json";
  sourceFile?: string;
  createdAt?: string;
  updatedAt?: string;
};

const ChatbotKnowledge = () => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"text" | "json">("text");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await api<{ items: KnowledgeItem[] }>("/api/chatbot/knowledge", { admin: true });
      setItems(res.items || []);
    } catch (e: unknown) {
      const msg = (e as Error)?.message || "Failed to load knowledge";
      setLoadError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createText = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setBusy(true);
    try {
      await api("/api/chatbot/knowledge", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), content, type: type === "json" ? "json" : "text" }),
        admin: true,
      });
      toast.success("Knowledge entry created");
      setTitle("");
      setContent("");
      await load();
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  const uploadDoc = async () => {
    if (!uploadTitle.trim() || !uploadFile) {
      toast.error("Title and file are required");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("title", uploadTitle.trim());
      fd.append("file", uploadFile);
      await api("/api/chatbot/knowledge/upload", { method: "POST", body: fd, admin: true });
      toast.success("File imported");
      setUploadTitle("");
      setUploadFile(null);
      await load();
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this knowledge entry?")) return;
    setBusy(true);
    try {
      await api(`/api/chatbot/knowledge/${id}`, { method: "DELETE", admin: true });
      toast.success("Deleted");
      await load();
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="font-headline text-3xl font-bold text-stone-900">Assistant knowledge base</h1>
          <p className="text-sm text-stone-600 max-w-2xl">
            Entries are matched when storefront visitors ask the chatbot. Upload PDF/JSON/text or paste curated
            answers.
          </p>
        </motion.div>

        {loadError && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
            <span className="text-sm">{loadError}</span>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Retry
            </Button>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-stone-900 flex items-center gap-2">
              <Icon name="edit_note" className="text-orange-600" /> New text entry
            </h2>
            <div className="space-y-2">
              <Label htmlFor="kb-title">Title</Label>
              <Input id="kb-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Shipping FAQ" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "text" | "json")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Plain text</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kb-content">Content</Label>
              <Textarea
                id="kb-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Detailed answer the bot can quote..."
                className="font-mono text-sm"
              />
            </div>
            <Button className="w-full" disabled={busy} onClick={() => void createText()}>
              Save entry
            </Button>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-stone-900 flex items-center gap-2">
              <Icon name="upload_file" className="text-orange-600" /> Upload PDF / JSON / text
            </h2>
            <div className="space-y-2">
              <Label htmlFor="up-title">Title</Label>
              <Input
                id="up-title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Policy document"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="up-file">File</Label>
              <Input
                id="up-file"
                type="file"
                accept=".pdf,.json,.txt,.md,application/pdf,application/json,text/plain"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-stone-500">PDF text is extracted server-side (requires pdf-parse).</p>
            </div>
            <Button variant="secondary" className="w-full" disabled={busy} onClick={() => void uploadDoc()}>
              Upload & extract
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">Entries ({items.length})</h2>
            <Button variant="ghost" size="sm" onClick={() => void load()}>
              <Icon name="refresh" className="text-lg" /> Refresh
            </Button>
          </div>
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={4} cols={3} />
            </div>
          ) : items.length === 0 ? (
            <p className="p-8 text-center text-sm text-stone-500">No entries yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {items.map((it) => (
                <li key={it._id} className="px-6 py-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{it.title}</p>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mt-1">
                      {it.type}
                      {it.sourceFile ? ` · ${it.sourceFile}` : ""}
                    </p>
                    <p className="text-sm text-stone-600 mt-2 line-clamp-3">{it.content}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-rose-700 border-rose-200 hover:bg-rose-50"
                    disabled={busy}
                    onClick={() => void remove(it._id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ChatbotKnowledge;
