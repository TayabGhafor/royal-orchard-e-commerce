import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { useCart } from "@/store/cart";
import { formatPKR } from "@/lib/format";
import { useProducts } from "@/store/products";
import { usePageLoading } from "@/hooks/use-page-loading";
import { Skeleton } from "@/components/ui/skeleton";

const AllProducts = () => {
  const addItem = useCart((s) => s.addItem);
  const setOpen = useCart((s) => s.setOpen);
  const items = useProducts((s) => s.items);
  const load = useProducts((s) => s.load);
  const apiLoading = useProducts((s) => s.loading);
  const apiError = useProducts((s) => s.error);
  const { loading, error, retry } = usePageLoading({ delay: 650 });
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (items.length === 0) load().catch(() => {});
  }, [items.length, load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.variety.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q),
    );
  }, [items, search]);

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-6 max-w-screen-2xl mx-auto">
        <header className="mb-10 flex flex-col gap-6">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Royal Orchard · Catalog</p>
              <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
                All Products
              </h1>
              <p className="text-on-surface-variant font-medium">
                Browse every available crate and seasonal variety.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-sm font-bold hover:border-primary/40 hover:text-primary transition-all"
            >
              <Icon name="arrow_back" className="text-base" /> Back to Shop
            </Link>
          </div>

          <div className="relative max-w-xl">
            <Icon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value.slice(0, 80))}
              placeholder="Search products…"
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-on-surface placeholder:text-on-surface-variant"
            />
          </div>
        </header>

        {error && (
          <div className="flex items-center justify-between gap-4 px-5 py-3 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
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

        {apiError && (
          <div className="flex items-center justify-between gap-4 px-5 py-3 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon name="error" /> {apiError}
            </div>
            <button
              onClick={() => load()}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white border border-rose-200 hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        )}

        {(loading || apiLoading) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-surface-container-lowest p-4 rounded-lg">
                <Skeleton className="aspect-square w-full rounded-md mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-outline">No products match your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-surface-container-lowest p-4 rounded-lg group hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5"
              >
                <Link to={`/product/${p.slug}`}>
                  <div className="aspect-square rounded-md overflow-hidden mb-4">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={p.images[0]}
                      alt={p.name}
                    />
                  </div>
                  <h4 className="font-bold text-lg">{p.name}</h4>
                  <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">{p.tagline}</p>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{formatPKR(p.price)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      addItem(p, p.weights[0]);
                      setOpen(true);
                    }}
                    className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all"
                    aria-label={`Add ${p.name}`}
                  >
                    <Icon name="add" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
};

export default AllProducts;

