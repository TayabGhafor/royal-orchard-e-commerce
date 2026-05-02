import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Icon } from "@/components/Icon";
import { useCart } from "@/store/cart";
import { formatPKR } from "@/lib/format";
import { usePageLoading } from "@/hooks/use-page-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/store/products";
import { unitPriceForWeight } from "@/lib/productPricing";
import type { WeightOption } from "@/data/products";

const ProductDetail = () => {
  const { slug } = useParams();
  const findBySlug = useProducts((s) => s.findBySlug);
  const items = useProducts((s) => s.items);
  useEffect(() => {
    if (items.length === 0) useProducts.getState().load();
  }, [items.length]);

  const product = slug ? findBySlug(slug) : undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(product?.weights[0] || "5kg");
  const addItem = useCart((s) => s.addItem);
  const setOpen = useCart((s) => s.setOpen);
  const navigate = useNavigate();
  const { loading, error, retry } = usePageLoading({ delay: 600 });

  useEffect(() => {
    if (!product) return;
    const first = (product.weights[0] || "5kg") as WeightOption;
    setSelectedWeight((prev) => (product.weights.includes(prev) ? prev : first));
  }, [product?.id, product?.weights]);

  if (!product && items.length > 0) return <Navigate to="/shop" replace />;

  const handleAdd = (openCart = true) => {
    if (!product) return;
    if (product.availabilityStatus === "Out of Stock") {
      toast.error("This product is currently out of stock.");
      return;
    }
    addItem(product, selectedWeight);
    if (openCart) setOpen(true);
    toast.success(`${product.name} added to your basket`);
  };

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <ScrollReveal variant="fade" duration={0.75} className="mb-8 block">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-outline hover:text-primary transition-colors"
          >
            <Icon name="arrow_back" className="text-base" /> Back to Shop
          </Link>
        </ScrollReveal>

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

        {loading || !product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="order-2 md:order-1 lg:order-1 lg:col-span-7 space-y-4">
              <Skeleton className="w-full aspect-[4/3] max-h-[min(52vh,420px)] lg:max-h-none lg:aspect-square rounded-2xl lg:rounded-lg" />
              <div className="grid grid-cols-3 gap-2 max-w-md lg:max-w-none mx-auto">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="aspect-square rounded-lg" />
              </div>
            </div>
            <div className="order-1 md:order-2 lg:order-2 lg:col-span-5 space-y-5">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-20 w-full lg:block hidden" />
              <Skeleton className="h-14 w-full rounded-full" />
              <Skeleton className="h-14 w-full rounded-full" />
            </div>
          </div>
        ) : (
        <ScrollReveal
          variant="fade-up"
          duration={0.9}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-8 lg:gap-16 items-start"
        >
          {/* Gallery: below purchase on mobile; left column md–lg; desktop col 1 */}
          <section className="order-2 md:order-1 lg:order-1 lg:col-span-7 w-full min-w-0">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative group"
            >
              <div className="overflow-hidden rounded-2xl lg:rounded-lg bg-surface-container-low aspect-[4/3] max-h-[min(52vh,420px)] md:max-h-[min(48vh,380px)] lg:max-h-none lg:aspect-square flex items-center justify-center mx-auto w-full">
                <img
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  src={product.images[activeImage]}
                  alt={product.name}
                />
              </div>
              <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 p-2 bg-white/25 backdrop-blur-md rounded-full">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                      i === activeImage ? "bg-primary" : "bg-white/50"
                    }`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 max-w-md lg:max-w-none mx-auto">
              {product.images.slice(0, 3).map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`rounded-lg overflow-hidden aspect-square bg-surface-container transition-opacity ${
                    i === activeImage ? "ring-2 ring-primary ring-offset-2" : "hover:opacity-80"
                  }`}
                >
                  <img className="w-full h-full object-cover" src={src} alt="" />
                </button>
              ))}
            </div>
          </section>

          {/* Purchase / summary: first on mobile & tablet stack; right column md–lg; sticky on desktop */}
          <section className="order-1 md:order-2 lg:order-2 lg:col-span-5 lg:sticky lg:top-32">
            <div className="space-y-6 md:space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3 md:mb-4 flex-wrap">
                  {product.badge && (
                    <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                      {product.badge.label}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-tertiary">
                    <Icon name="star" filled className="text-sm" />
                    <span className="text-xs sm:text-sm font-bold">
                      {product.rating} ({product.reviews} Reviews)
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="mt-3 text-on-surface-variant text-sm sm:text-base leading-relaxed lg:hidden">
                  {product.tagline}
                </p>
                <p className="mt-5 sm:mt-6 text-lg sm:text-xl font-bold text-primary font-headline">
                  {formatPKR(unitPriceForWeight(product, selectedWeight))}
                  <span className="text-sm font-normal text-outline"> / {selectedWeight}</span>
                </p>
                {product.availabilityStatus === "Out of Stock" && (
                  <p className="mt-2 text-sm font-semibold text-rose-600">Out of stock</p>
                )}
              </div>

              <p className="hidden lg:block text-on-surface-variant leading-relaxed">{product.description}</p>

              <div className="space-y-3 sm:space-y-4">
                <label className="text-xs sm:text-sm font-bold uppercase tracking-widest text-outline">
                  Select Weight
                </label>
                <div className="flex flex-row gap-2 sm:gap-3 md:gap-4">
                  {(["3kg", "5kg", "8kg"] as const).map((w) => {
                    const available = product.weights.includes(w);
                    const active = selectedWeight === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        disabled={!available}
                        onClick={() => setSelectedWeight(w)}
                        className={`flex-1 py-3 sm:py-4 rounded-lg border-2 text-sm sm:text-base font-bold transition-all ${
                          active
                            ? "border-primary bg-primary-container text-on-primary-container"
                            : available
                            ? "border-outline-variant hover:border-primary text-on-surface-variant"
                            : "border-outline-variant/20 text-outline/40 cursor-not-allowed"
                        }`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 pt-2">
                <button
                  type="button"
                  disabled={product.availabilityStatus === "Out of Stock"}
                  onClick={() => handleAdd(true)}
                  className="w-full py-4 sm:py-5 bg-secondary-container text-on-secondary-container rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="shopping_cart" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  disabled={product.availabilityStatus === "Out of Stock"}
                  onClick={() => {
                    handleAdd(false);
                    navigate("/checkout");
                  }}
                  className="w-full py-4 sm:py-5 editorial-gradient text-on-primary rounded-full font-bold text-base sm:text-lg hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <Icon name="eco" className="text-secondary" />
                  <span className="text-sm font-medium">100% Organic</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="local_shipping" className="text-secondary" />
                  <span className="text-sm font-medium">Express Delivery</span>
                </div>
              </div>
            </div>
          </section>

          {/* Full story + trust — mobile/tablet only, below gallery row */}
          <div className="order-3 md:col-span-2 lg:col-span-12 lg:hidden space-y-6 pt-2 border-t border-outline-variant/20">
            <p className="text-on-surface-variant leading-relaxed text-sm sm:text-base">{product.description}</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl bg-surface-container-low px-3 py-3">
                <Icon name="eco" className="text-secondary shrink-0" />
                <span className="text-xs sm:text-sm font-medium leading-snug">100% Organic</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl bg-surface-container-low px-3 py-3">
                <Icon name="local_shipping" className="text-secondary shrink-0" />
                <span className="text-xs sm:text-sm font-medium leading-snug">Express Delivery</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
        )}

        {/* Reviews */}
        <ScrollReveal as="section" variant="fade-up" duration={0.88} className="mt-32 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-headline font-bold text-on-surface">Customer Stories</h2>
              <p className="text-on-surface-variant mt-2">Hear from our orchard community</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "Literally the best mangoes I've had in years. No fibers at all, just pure melt-in-your-mouth sweetness. Shipping was incredibly fast too.",
                name: "Sophia Martinez",
                initial: "S",
                bg: "bg-primary-fixed text-on-primary-fixed",
              },
              {
                text: "The aroma filled my entire kitchen the moment I opened the box. You can tell these are orchard-fresh. Highly recommend the 5kg box.",
                name: "James Wilson",
                initial: "J",
                bg: "bg-secondary-fixed text-on-secondary-fixed",
              },
              {
                text: "Incredible quality. One mango was a bit bruised during transit, but the customer support team replaced it immediately. Five star service.",
                name: "Marcus Chen",
                initial: "M",
                bg: "bg-tertiary-fixed text-on-tertiary-fixed",
              },
            ].map((r) => (
              <div key={r.name} className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
                <div className="flex gap-1 text-tertiary mb-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" filled className="text-sm" />
                  ))}
                </div>
                <p className="italic text-on-surface mb-6 leading-relaxed">"{r.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${r.bg} flex items-center justify-center font-bold`}>
                    {r.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-outline">Verified Purchase</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </SiteShell>
  );
};

export default ProductDetail;
