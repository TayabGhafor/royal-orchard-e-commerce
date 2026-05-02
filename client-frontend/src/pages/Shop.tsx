import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { type Product, type WeightOption } from "@/data/products";
import { useCart } from "@/store/cart";
import { formatPKR } from "@/lib/format";
import { usePageLoading } from "@/hooks/use-page-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/store/products";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ShopCatalogSearch } from "@/components/ShopCatalogSearch";

const varieties = ["All", "Sindhri", "Chaunsa", "Anwar Ratol", "Langra"] as const;
const weights: (WeightOption | "All")[] = ["All", "3kg", "5kg", "8kg"];

const Shop = () => {
  const [variety, setVariety] = useState<(typeof varieties)[number]>("All");
  const [weight, setWeight] = useState<(typeof weights)[number]>("All");
  const [search, setSearch] = useState("");
  const addItem = useCart((s) => s.addItem);
  const setOpen = useCart((s) => s.setOpen);
  const { loading, error, retry } = usePageLoading({ delay: 700 });
  const items = useProducts((s) => s.items);
  const apiLoading = useProducts((s) => s.loading);
  const apiError = useProducts((s) => s.error);
  const loadedOnce = useProducts((s) => s.loadedOnce);

  useEffect(() => {
    if (!loadedOnce) {
      useProducts.getState().load();
    }
  }, [loadedOnce]);

  const baseFiltered = useMemo(
    () =>
      items.filter(
        (p) =>
          (variety === "All" || p.variety === variety) &&
          (weight === "All" || p.weights.includes(weight as WeightOption)),
      ),
    [items, variety, weight],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return baseFiltered;
    return baseFiltered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.variety.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [baseFiltered, search]);

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-4 sm:px-6 max-w-screen-2xl mx-auto">
        {/* Hero carousel */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <HeroCarousel />
        </div>

        <div id="catalog" className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-72 space-y-10">
            <div className="lg:sticky lg:top-32">
              <h3 className="font-headline font-bold text-xl mb-6">Refine Selection</h3>
              <div className="space-y-8">
                <section>
                  <label
                    htmlFor="shop-catalog-search"
                    className="block text-xs font-bold text-outline-variant tracking-widest uppercase mb-4"
                  >
                    Search
                  </label>
                  <ShopCatalogSearch
                    inputId="shop-catalog-search"
                    value={search}
                    onChange={setSearch}
                    items={items}
                    variety={variety}
                    weight={weight}
                  />
                </section>

                <section>
                  <label className="block text-xs font-bold text-outline-variant tracking-widest uppercase mb-4">
                    Variety
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {varieties.map((v) => (
                      <button
                        key={v}
                        onClick={() => setVariety(v)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          variety === v
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="block text-xs font-bold text-outline-variant tracking-widest uppercase mb-4">
                    Weight
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {weights.map((w) => (
                      <button
                        key={w}
                        onClick={() => setWeight(w)}
                        className={`py-2 rounded-lg text-sm font-bold transition-all ${
                          weight === w
                            ? "bg-tertiary-container text-on-tertiary-container"
                            : "border border-outline-variant hover:border-primary hover:text-primary"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
              <div className="mt-12 p-6 rounded-lg bg-primary-fixed/30 text-on-primary-fixed-variant">
                <Icon name="temp_preferences_custom" className="mb-2" />
                <h4 className="font-bold text-sm mb-1">Temperature Controlled</h4>
                <p className="text-xs opacity-80">
                  Shipped in specialized organic packaging to maintain farm freshness.
                </p>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-1 space-y-20">
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

            {(!loadedOnce || loading || apiLoading) ? (
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-surface-container-lowest rounded-lg overflow-hidden p-4">
                      <Skeleton className="aspect-[4/3] w-full rounded-md mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-6" />
                      <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
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
              </section>
            ) : apiError ? (
              <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon name="error" /> {apiError}
                </div>
                <button
                  onClick={() => useProducts.getState().load()}
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white border border-rose-200 hover:bg-rose-100"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
            {featured.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-headline font-extrabold tracking-tight">Seasonal Highlights</h2>
                    <p className="text-on-surface-variant">
                      Available for a limited time during the peak harvest moon.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featured.map((p) => (
                    <FeaturedCard
                      key={p.id}
                      p={p}
                      onAdd={() => {
                        addItem(p, p.weights[0]);
                        setOpen(true);
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold tracking-tight">All Varieties</h2>
                  <p className="text-on-surface-variant">The full catalog of Royal Orchard excellence.</p>
                </div>
                <Link
                  to="/all-products"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-sm font-bold hover:border-primary/40 hover:text-primary transition-all"
                >
                  View all <Icon name="arrow_forward" className="text-base" />
                </Link>
              </div>
              {rest.length === 0 && filtered.length === 0 ? (
                <div className="py-20 text-center text-outline">No products match these filters.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(rest.length > 0 ? rest : filtered).map((p) => (
                    <SmallCard
                      key={p.id}
                      p={p}
                      onAdd={() => {
                        addItem(p, p.weights[0]);
                        setOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
              </>
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
};

const FeaturedCard = ({ p, onAdd }: { p: Product; onAdd: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-surface-container-lowest rounded-lg overflow-hidden group border border-transparent hover:border-primary-fixed/50 transition-all duration-500 card-hover shine-on-hover"
  >
    <Link to={`/product/${p.slug}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden m-4 rounded-md">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          src={p.images[0]}
          alt={p.name}
        />
        {p.badge && (
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full ${
                p.badge.tone === "secondary"
                  ? "bg-secondary-fixed text-on-secondary-fixed-variant"
                  : p.badge.tone === "tertiary"
                  ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                  : "bg-primary-fixed text-on-primary-fixed-variant"
              }`}
            >
              {p.badge.label}
            </span>
          </div>
        )}
      </div>
      <div className="px-8 pb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-2xl font-headline font-bold">{p.name}</h3>
            <p className="text-sm text-on-surface-variant mt-1">{p.tagline}</p>
          </div>
          <span className="text-xl font-bold text-primary">{formatPKR(p.price)}</span>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-outline font-medium">
            {p.weights.length} pack sizes available
          </span>
        </div>
      </div>
    </Link>
    <div className="px-8 pb-8 -mt-6">
      <button
        onClick={onAdd}
        className="w-full py-4 bg-secondary-container text-on-secondary-container rounded-full font-bold flex items-center justify-center gap-2 hover:bg-secondary hover:text-on-secondary transition-colors"
      >
        <Icon name="shopping_basket" className="text-xl" />
        Quick Add to Box
      </button>
    </div>
  </motion.div>
);

const SmallCard = ({ p, onAdd }: { p: Product; onAdd: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-surface-container-lowest p-4 rounded-lg group hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 card-hover shine-on-hover"
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
        onClick={onAdd}
        className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all"
        aria-label={`Add ${p.name}`}
      >
        <Icon name="add" />
      </button>
    </div>
  </motion.div>
);

export default Shop;
