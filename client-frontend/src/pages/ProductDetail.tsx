import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { useCart } from "@/store/cart";
import { formatPKR } from "@/lib/format";
import { usePageLoading } from "@/hooks/use-page-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/store/products";

const ProductDetail = () => {
  const { slug } = useParams();
  const load = useProducts((s) => s.load);
  const findBySlug = useProducts((s) => s.findBySlug);
  const items = useProducts((s) => s.items);
  useEffect(() => {
    if (items.length === 0) load();
  }, [items.length, load]);

  const product = slug ? findBySlug(slug) : undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product?.weights[0] || "5kg");
  const addItem = useCart((s) => s.addItem);
  const setOpen = useCart((s) => s.setOpen);
  const navigate = useNavigate();
  const { loading, error, retry } = usePageLoading({ delay: 600 });

  if (!product && items.length > 0) return <Navigate to="/shop" replace />;

  const handleAdd = (openCart = true) => {
    addItem(product, selectedWeight as never);
    if (openCart) setOpen(true);
    toast.success(`${product.name} added to your basket`);
  };

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-outline hover:text-primary transition-colors mb-8"
        >
          <Icon name="arrow_back" className="text-base" /> Back to Shop
        </Link>

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

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Skeleton className="aspect-square rounded-md" />
                <Skeleton className="aspect-square rounded-md" />
                <Skeleton className="aspect-square rounded-md" />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-14 w-full rounded-full" />
              <Skeleton className="h-14 w-full rounded-full" />
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <section className="lg:col-span-7">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative group"
            >
              <div className="overflow-hidden rounded-lg bg-surface-container-low aspect-square flex items-center justify-center">
                <img
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  src={product.images[activeImage]}
                  alt={product.name}
                />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-white/20 backdrop-blur-md rounded-full">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === activeImage ? "bg-primary" : "bg-white/40"
                    }`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {product.images.slice(0, 3).map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`rounded-md overflow-hidden aspect-square bg-surface-container transition-opacity ${
                    i === activeImage ? "border-2 border-primary" : "hover:opacity-80"
                  }`}
                >
                  <img className="w-full h-full object-cover" src={src} alt="" />
                </button>
              ))}
            </div>
          </section>

          <section className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {product.badge && (
                    <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      {product.badge.label}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-tertiary">
                    <Icon name="star" filled className="text-sm" />
                    <span className="text-sm font-bold">
                      {product.rating} ({product.reviews} Reviews)
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="mt-6 text-xl font-bold text-primary font-headline">
                  {formatPKR(product.price)}
                  <span className="text-sm font-normal text-outline"> / {selectedWeight}</span>
                </p>
              </div>
              <p className="text-on-surface-variant leading-relaxed">{product.description}</p>

              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-widest text-outline">
                  Select Weight
                </label>
                <div className="flex gap-4">
                  {(["3kg", "5kg", "8kg"] as const).map((w) => {
                    const available = product.weights.includes(w);
                    const active = selectedWeight === w;
                    return (
                      <button
                        key={w}
                        disabled={!available}
                        onClick={() => setSelectedWeight(w)}
                        className={`flex-1 py-4 rounded-lg border-2 font-bold transition-all ${
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

              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={() => handleAdd(true)}
                  className="w-full py-5 bg-secondary-container text-on-secondary-container rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-sm"
                >
                  <Icon name="shopping_cart" />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    handleAdd(false);
                    navigate("/checkout");
                  }}
                  className="w-full py-5 editorial-gradient text-on-primary rounded-full font-bold text-lg hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  Buy Now
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-outline-variant/20">
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
        </div>
        )}

        {/* Reviews */}
        <section className="mt-32 space-y-12">
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
        </section>
      </div>
    </SiteShell>
  );
};

export default ProductDetail;
