import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Icon } from "@/components/Icon";
import { useAdmin, type AdminProduct } from "@/store/admin";
import { formatPKR } from "@/lib/format";
import type { ProductAvailability, WeightOption } from "@/data/products";
import { minListedPrice } from "@/lib/productPricing";
import { usePageLoading } from "@/hooks/use-page-loading";
import { TableSkeleton } from "@/components/admin/AdminSkeletons";
import { uploadImages } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filterTriggerClass =
  "h-11 gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm outline-none transition-all hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-sm focus:ring-2 focus:ring-orange-100 focus:ring-offset-0 focus:border-orange-300 data-[state=open]:border-orange-400 data-[state=open]:bg-orange-50/40 data-[state=open]:shadow-md data-[state=open]:ring-2 data-[state=open]:ring-orange-100 [&_[data-radix-select-value]]:min-w-0 [&_[data-radix-select-value]]:truncate";

type FormState = {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  weightPrices: Partial<Record<WeightOption, number>>;
  availabilityStatus: ProductAvailability;
  variety: AdminProduct["variety"];
  collection: AdminProduct["collection"];
  weights: WeightOption[];
  imagesText: string;
};

const empty: FormState = {
  name: "",
  tagline: "",
  description: "",
  weightPrices: { "3kg": 0, "5kg": 0, "8kg": 0 },
  availabilityStatus: "In Stock",
  variety: "Sindhri",
  collection: "Premium Reserve",
  weights: ["3kg", "5kg", "8kg"],
  imagesText: "",
};

const Products = () => {
  const products = useAdmin((s) => s.products);
  const loadProducts = useAdmin((s) => s.loadProducts);
  const addProduct = useAdmin((s) => s.addProduct);
  const updateProduct = useAdmin((s) => s.updateProduct);
  const deleteProduct = useAdmin((s) => s.deleteProduct);
  const { loading, error, retry } = usePageLoading({ delay: 600 });

  const [search, setSearch] = useState("");
  const [collectionFilter, setCollectionFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | ProductAvailability>("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [imageMode, setImageMode] = useState<"urls" | "upload">("urls");
  const [uploading, setUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [failedUrlPreviews, setFailedUrlPreviews] = useState<Record<string, boolean>>({});

  const uploadPreviewUrls = useMemo(
    () => uploadFiles.map((f) => ({ key: `${f.name}-${f.size}-${f.lastModified}`, file: f, url: URL.createObjectURL(f) })),
    [uploadFiles],
  );

  useEffect(() => {
    return () => {
      uploadPreviewUrls.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [uploadPreviewUrls]);

  useEffect(() => {
    loadProducts().catch((e) => toast.error(e?.message || "Failed to load products"));
  }, [loadProducts]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const m1 = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const m2 = collectionFilter === "All" || p.collection === collectionFilter;
      const m3 = statusFilter === "All" || p.availabilityStatus === statusFilter;
      return m1 && m2 && m3;
    });
  }, [products, search, collectionFilter, statusFilter]);

  const openCreate = () => {
    setForm(empty);
    setUploadFiles([]);
    setFailedUrlPreviews({});
    setImageMode("urls");
    setOpen(true);
  };

  const openEdit = (p: AdminProduct) => {
    setForm({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      weightPrices: { ...p.weightPrices },
      availabilityStatus: p.availabilityStatus,
      variety: p.variety,
      collection: p.collection,
      weights: p.weights,
      imagesText: p.images.join("\n"),
    });
    setUploadFiles([]);
    setFailedUrlPreviews({});
    setImageMode("urls");
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlImages =
      imageMode === "urls"
        ? form.imagesText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    if (!form.name.trim()) return toast.error("Name is required");
    if (form.weights.length === 0) return toast.error("Select at least one weight option");
    for (const w of form.weights) {
      const n = Number(form.weightPrices[w]);
      if (!Number.isFinite(n) || n <= 0) return toast.error(`Enter a valid PKR price for ${w}`);
    }

    let images: string[] = [];
    try {
      if (imageMode === "urls") {
        images = urlImages;
        if (images.length < 1) return toast.error("Add at least 1 image URL");
        if (images.length > 5) return toast.error("Maximum 5 images allowed");
      } else {
        if (uploadFiles.length < 1) return toast.error("Upload at least 1 image");
        if (uploadFiles.length > 5) return toast.error("Maximum 5 images allowed");
        setUploading(true);
        const res = await uploadImages(uploadFiles);
        images = res.urls;
      }
    } catch (err: any) {
      toast.error(err?.message || "Unable to process images");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    const weightPrices = Object.fromEntries(
      form.weights.map((w) => [w, Number(form.weightPrices[w])]),
    ) as Record<WeightOption, number>;

    const payload = {
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      weightPrices,
      availabilityStatus: form.availabilityStatus,
      variety: form.variety,
      collection: form.collection,
      weights: form.weights,
      images,
      rating: 4.5,
      reviews: 0,
    };
    try {
      if (form.id) {
        await updateProduct(form.id, payload);
        toast.success("Product updated");
      } else {
        await addProduct(payload);
        toast.success("Product added");
      }
      setOpen(false);
      setUploadFiles([]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save product");
    }
  };

  const toggleWeight = (w: WeightOption) => {
    setForm((f) => {
      const on = f.weights.includes(w);
      const weights = on ? f.weights.filter((x) => x !== w) : [...f.weights, w];
      const weightPrices = { ...f.weightPrices };
      if (on) delete weightPrices[w];
      return { ...f, weights, weightPrices };
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Product Management</h1>
            <p className="text-stone-500 mt-1">Manage your mango inventory ({products.length} items)</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors"
          >
            <Icon name="add" className="text-xl" />
            New Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full">
            <Icon name="search" className="text-stone-400 text-base" />
            <input
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none bg-transparent text-sm"
            />
          </div>
          <Select value={collectionFilter} onValueChange={setCollectionFilter}>
            <SelectTrigger
              aria-label="Filter by collection"
              className={cn(filterTriggerClass, "min-w-[12.5rem] max-w-full sm:min-w-[14rem]")}
            >
              <Icon name="category" className="shrink-0 text-lg text-orange-500" />
              <SelectValue placeholder="Collection" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={6}
              className="z-50 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl"
            >
              <SelectItem value="All" className="rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium focus:bg-orange-50 focus:text-stone-900">
                All collections
              </SelectItem>
              <SelectItem
                value="Premium Reserve"
                className="rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium focus:bg-orange-50 focus:text-stone-900"
              >
                Premium Reserve
              </SelectItem>
              <SelectItem
                value="Seasonal Specials"
                className="rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium focus:bg-orange-50 focus:text-stone-900"
              >
                Seasonal Specials
              </SelectItem>
              <SelectItem
                value="Bulk Harvest"
                className="rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium focus:bg-orange-50 focus:text-stone-900"
              >
                Bulk Harvest
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
          >
            <SelectTrigger
              aria-label="Filter by stock status"
              className={cn(filterTriggerClass, "min-w-[11rem] max-w-full")}
            >
              <Icon name="inventory_2" className="shrink-0 text-lg text-orange-500" />
              <SelectValue placeholder="Stock status" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={6}
              className="z-50 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl"
            >
              <SelectItem value="All" className="rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium focus:bg-orange-50 focus:text-stone-900">
                All statuses
              </SelectItem>
              <SelectItem
                value="In Stock"
                className="rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium focus:bg-orange-50 focus:text-stone-900"
              >
                In Stock
              </SelectItem>
              <SelectItem
                value="Out of Stock"
                className="rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium focus:bg-orange-50 focus:text-stone-900"
              >
                Out of Stock
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {error && (
          <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon name="error" /> {error}
            </div>
            <button
              onClick={retry}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white border border-rose-200 hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        )}
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-stone-400 text-xs uppercase tracking-wider border-b border-stone-100">
                <th className="text-left px-6 py-4 font-semibold">Product</th>
                <th className="text-left font-semibold">Collection</th>
                <th className="text-left font-semibold">From (PKR)</th>
                <th className="text-left font-semibold">Weights</th>
                <th className="text-left font-semibold">Status</th>
                <th className="text-right pr-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold text-sm">{p.name}</div>
                        <div className="text-xs text-stone-500">{p.variety}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">{p.collection}</td>
                  <td className="text-sm font-semibold">{formatPKR(minListedPrice(p))}</td>
                  <td className="text-xs text-stone-600">{p.weights.join(", ")}</td>
                  <td>
                    {p.availabilityStatus === "Out of Stock" ? (
                      <span className="text-rose-600 text-sm font-semibold">Out of Stock</span>
                    ) : (
                      <span className="text-emerald-600 text-sm font-semibold">In Stock</span>
                    )}
                  </td>
                  <td className="pr-6">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-600 flex items-center justify-center"
                        aria-label="Edit"
                      >
                        <Icon name="edit" className="text-base" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${p.name}"?`)) {
                            deleteProduct(p.id)
                              .then(() => toast.success("Product deleted"))
                              .catch((err: any) => toast.error(err?.message || "Failed to delete product"));
                          }
                        }}
                        className="w-8 h-8 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center"
                        aria-label="Delete"
                      >
                        <Icon name="delete" className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-stone-400 py-12 text-sm">
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.form
            onSubmit={submit}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl p-8 my-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{form.id ? "Edit Product" : "New Product"}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Title">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Status">
                <div className="relative">
                  <select
                    value={form.availabilityStatus}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availabilityStatus: e.target.value as ProductAvailability,
                      })
                    }
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400">
                    <Icon name="expand_more" className="text-base" />
                  </span>
                </div>
              </Field>
              <Field label="Tagline">
                <input
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Variety">
                <div className="relative">
                  <select
                    value={form.variety}
                    onChange={(e) => setForm({ ...form, variety: e.target.value as AdminProduct["variety"] })}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    {(["Sindhri", "Chaunsa", "Anwar Ratol", "Langra", "Mixed", "Other"] as const).map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400">
                    <Icon name="expand_more" className="text-base" />
                  </span>
                </div>
              </Field>
              <Field label="Collection">
                <div className="relative">
                  <select
                    value={form.collection}
                    onChange={(e) => setForm({ ...form, collection: e.target.value as AdminProduct["collection"] })}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option>Premium Reserve</option>
                    <option>Seasonal Specials</option>
                    <option>Bulk Harvest</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400">
                    <Icon name="expand_more" className="text-base" />
                  </span>
                </div>
              </Field>
            </div>

            <div className="mt-4">
              <label className="text-xs uppercase tracking-widest text-stone-500 font-bold">Weights & prices (PKR)</label>
              <p className="text-xs text-stone-500 mt-1 mb-2">Select pack sizes and enter the price for each.</p>
              <div className="flex gap-2 mt-2">
                {(["3kg", "5kg", "8kg"] as WeightOption[]).map((w) => {
                  const on = form.weights.includes(w);
                  return (
                    <button
                      type="button"
                      key={w}
                      onClick={() => toggleWeight(w)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        on ? "bg-orange-500 text-white" : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {form.weights.map((w) => (
                  <Field key={w} label={`${w} — PKR`}>
                    <input
                      type="number"
                      required
                      min={1}
                      step={1}
                      value={form.weightPrices[w] ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          weightPrices: {
                            ...form.weightPrices,
                            [w]: Number(e.target.value),
                          },
                        })
                      }
                      className={inputCls}
                    />
                  </Field>
                ))}
              </div>
            </div>

            <Field label="Description" className="mt-4">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputCls}
              />
            </Field>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs uppercase tracking-widest text-stone-500 font-bold">Product Images</label>
                <div className="flex bg-stone-100 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setImageMode("urls");
                      setUploadFiles([]);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                      imageMode === "urls" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    URLs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageMode("upload");
                      setForm((f) => ({ ...f, imagesText: "" }));
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                      imageMode === "upload" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {imageMode === "urls" ? (
                <div className="mt-2">
                  <textarea
                    rows={4}
                    placeholder={"https://…\nhttps://…"}
                    value={form.imagesText}
                    onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
                    className={`${inputCls} font-mono text-xs`}
                  />
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {form.imagesText
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .slice(0, 5)
                      .map((src, idx) => (
                        <div
                          key={`${src}-${idx}`}
                          className="aspect-square rounded-lg overflow-hidden bg-stone-50 border border-stone-200"
                          title={src}
                        >
                          {failedUrlPreviews[`${src}-${idx}`] ? (
                            <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-semibold">
                              Invalid
                            </div>
                          ) : (
                            <img
                              src={src}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={() =>
                                setFailedUrlPreviews((prev) => ({ ...prev, [`${src}-${idx}`]: true }))
                              }
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 text-sm font-semibold cursor-pointer hover:bg-stone-100 hover:border-stone-300 transition-colors">
                      <Icon name="upload" className="text-base text-stone-500" />
                      <span>Choose files</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const incoming = Array.from(e.target.files || []);
                          setUploadFiles((prev) => {
                            const merged = [...prev];
                            for (const file of incoming) {
                              const exists = merged.some(
                                (f) =>
                                  f.name === file.name &&
                                  f.size === file.size &&
                                  f.lastModified === file.lastModified,
                              );
                              if (!exists && merged.length < 5) merged.push(file);
                            }
                            return merged.slice(0, 5);
                          });
                          e.currentTarget.value = "";
                        }}
                        className="sr-only"
                      />
                    </label>
                    <span className="text-xs text-stone-500 font-semibold">
                      {uploadFiles.length}/5 selected
                    </span>
                  </div>
                  {uploadFiles.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {uploadPreviewUrls.map((p) => (
                        <div
                          key={p.key}
                          className="aspect-square rounded-lg overflow-hidden bg-stone-50 border border-stone-200"
                          title={p.file.name}
                        >
                          <img src={p.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 rounded-full font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                {uploading ? "Uploading..." : form.id ? "Save changes" : "Create Product"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </AdminLayout>
  );
};

const inputCls =
  "w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200";

const Field = ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs uppercase tracking-widest text-stone-500 font-bold">{label}</label>
    {children}
  </div>
);

export default Products;
