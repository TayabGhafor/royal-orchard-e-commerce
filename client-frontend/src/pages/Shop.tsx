import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { type Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { formatPKR } from "@/lib/format";
import { minListedPrice } from "@/lib/productPricing";
import { usePageLoading } from "@/hooks/use-page-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/store/products";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ShopCatalogSearch } from "@/components/ShopCatalogSearch";

const varieties = ["All", "Sindhri", "Chaunsa", "Anwar Ratol", "Langra"] as const;

const Shop = () => {
  const [variety, setVariety] = useState<(typeof varieties)[number]>("All");
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
    () => items.filter((p) => variety === "All" || p.variety === variety),
    [items, variety],
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

        <div
          id="catalog"
          className="flex flex-col md:flex-row-reverse lg:flex-row gap-6 md:gap-8 lg:gap-12 items-start"
        >
          {/* FILTERS: sticky — top bar on mobile, right column tablet, left sidebar desktop */}
          <aside className="w-full md:w-[min(100%,280px)] lg:w-72 shrink-0 md:shrink-0 z-30 space-y-6 lg:space-y-10">
            <div className="sticky top-20 md:top-28 lg:top-32 rounded-2xl border border-outline-variant/15 bg-surface/95 backdrop-blur-md shadow-sm md:border-transparent md:bg-transparent/95 md:backdrop-blur-sm lg:border-0 lg:bg-transparent lg:backdrop-blur-none p-4 sm:p-5 md:p-0">
              <h3 className="font-headline font-bold text-lg sm:text-xl mb-4 md:mb-6">Refine Selection</h3>
              <div className="space-y-6 md:space-y-8">
                <section>
                  <label
                    htmlFor="shop-catalog-search"
                    className="block text-xs font-bold text-outline-variant tracking-widest uppercase mb-3 md:mb-4"
                  >
                    Search
                  </label>
                  <ShopCatalogSearch
                    inputId="shop-catalog-search"
                    value={search}
                    onChange={setSearch}
                    items={items}
                    variety={variety}
                  />
                </section>

                <section>
                  <label className="block text-xs font-bold text-outline-variant tracking-widest uppercase mb-3 md:mb-4">
                    Variety
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {varieties.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVariety(v)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
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
              </div>
              <div className="mt-6 md:mt-10 lg:mt-12 p-4 sm:p-6 rounded-xl lg:rounded-lg bg-primary-fixed/30 text-on-primary-fixed-variant">
                <Icon name="temp_preferences_custom" className="mb-2 text-lg" />
                <h4 className="font-bold text-sm mb-1">Temperature Controlled</h4>
                <p className="text-xs opacity-80 leading-relaxed">
                  Shipped in specialized organic packaging to maintain farm freshness.
                </p>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID — scrolls while filters stay sticky on md+ */}
          <div className="flex-1 min-w-0 space-y-12 sm:space-y-16 lg:space-y-20">
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
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-8 mb-12 md:mb-20">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-surface-container-lowest rounded-lg overflow-hidden p-4">
                      <Skeleton className="aspect-[4/3] w-full rounded-md mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-6" />
                      <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-surface-container-lowest p-3 sm:p-4 rounded-lg">
                      <Skeleton className="aspect-square w-full rounded-md mb-3 sm:mb-4" />
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
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-headline font-extrabold tracking-tight">Seasonal Highlights</h2>
                  <p className="text-on-surface-variant text-sm sm:text-base mt-1">
                    Available for a limited time during the peak harvest moon.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-8">
                  {featured.map((p) => (
                    <FeaturedCard
                      key={p.id}
                      p={p}
                      onAdd={() => {
                        addItem(p, p.weights[0]!);
                        setOpen(true);
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-headline font-extrabold tracking-tight">All Varieties</h2>
                  <p className="text-on-surface-variant text-sm sm:text-base">
                    The full catalog of Royal Orchard excellence.
                  </p>
                </div>
                <Link
                  to="/all-products"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-xs sm:text-sm font-bold hover:border-primary/40 hover:text-primary transition-all shrink-0"
                >
                  View all <Icon name="arrow_forward" className="text-base" />
                </Link>
              </div>
              {rest.length === 0 && filtered.length === 0 ? (
                <div className="py-20 text-center text-outline">No products match these filters.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {(rest.length > 0 ? rest : filtered).map((p) => (
                    <SmallCard
                      key={p.id}
                      p={p}
                      onAdd={() => {
                        addItem(p, p.weights[0]!);
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

const FeaturedCard = ({ p, onAdd }: { p: Product; onAdd: () => void }) => {
  const out = p.availabilityStatus === "Out of Stock";
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-surface-container-lowest rounded-xl sm:rounded-lg overflow-hidden group border border-transparent hover:border-primary-fixed/50 transition-all duration-500 card-hover shine-on-hover flex flex-col h-full"
  >
    <Link to={`/product/${p.slug}`} className="block flex-1 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden m-2 sm:m-3 md:m-4 rounded-md">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          src={p.images[0]}
          alt={p.name}
        />
        {p.badge && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <span
              className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] font-black tracking-widest uppercase rounded-full ${
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
        {out && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-[10px] sm:text-sm uppercase tracking-widest text-center px-2">
              Out of stock
            </span>
          </div>
        )}
      </div>
      <div className="px-3 pb-3 pt-1 sm:px-6 sm:pb-6 md:px-8 md:pb-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-xl md:text-2xl font-headline font-bold leading-snug line-clamp-2">{p.name}</h3>
            <p className="text-[11px] sm:text-sm text-on-surface-variant mt-0.5 sm:mt-1 line-clamp-2">{p.tagline}</p>
          </div>
          <span className="text-sm sm:text-lg md:text-xl font-bold text-primary text-right shrink-0">
            <span className="block text-[8px] sm:text-[10px] font-bold text-outline uppercase tracking-tighter">From</span>
            {formatPKR(minListedPrice(p))}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-3 sm:mb-6 mt-auto">
          <span className="text-[10px] sm:text-xs text-outline font-medium">
            {p.weights.length} pack sizes
          </span>
        </div>
      </div>
    </Link>
    <div className="px-3 pb-3 sm:px-6 sm:pb-6 md:px-8 md:pb-8 -mt-2 sm:-mt-4 md:-mt-6">
      <button
        type="button"
        disabled={out}
        onClick={onAdd}
        className="w-full py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base bg-secondary-container text-on-secondary-container rounded-full font-bold flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-secondary hover:text-on-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon name="shopping_basket" className="text-lg sm:text-xl shrink-0" />
        <span className="truncate">{out ? "Unavailable" : "Quick Add"}</span>
      </button>
    </div>
  </motion.div>
  );
};

const SmallCard = ({ p, onAdd }: { p: Product; onAdd: () => void }) => {
  const out = p.availabilityStatus === "Out of Stock";
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-surface-container-lowest p-2.5 sm:p-4 rounded-xl sm:rounded-lg group hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 card-hover shine-on-hover h-full flex flex-col"
  >
    <Link to={`/product/${p.slug}`} className="flex-1 flex flex-col">
      <div className="aspect-square rounded-lg sm:rounded-md overflow-hidden mb-2 sm:mb-4 relative bg-surface-container-low">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={p.images[0]}
          alt={p.name}
        />
        {out && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">Out</span>
          </div>
        )}
      </div>
      <h4 className="font-bold text-xs sm:text-base leading-tight line-clamp-2 flex-1">{p.name}</h4>
      <p className="text-[10px] sm:text-xs text-on-surface-variant mb-2 sm:mb-4 line-clamp-2">{p.tagline}</p>
    </Link>
    <div className="flex items-center justify-between gap-1 mt-auto pt-1">
      <span className="font-bold text-primary text-xs sm:text-base tabular-nums">{formatPKR(minListedPrice(p))}</span>
      <button
        type="button"
        disabled={out}
        onClick={onAdd}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all disabled:opacity-40 disabled:pointer-events-none shrink-0"
        aria-label={`Add ${p.name}`}
      >
        <Icon name="add" className="text-lg sm:text-[24px]" />
      </button>
    </div>
  </motion.div>
  );
};

export default Shop;
