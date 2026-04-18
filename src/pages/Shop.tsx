import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { products, type Product, type WeightOption } from "@/data/products";
import { useCart } from "@/store/cart";

const varieties = ["All", "Sindhri", "Chaunsa", "Anwar Ratol", "Langra"] as const;
const weights: (WeightOption | "All")[] = ["All", "3kg", "5kg", "8kg"];

const Shop = () => {
  const [variety, setVariety] = useState<(typeof varieties)[number]>("All");
  const [weight, setWeight] = useState<(typeof weights)[number]>("All");
  const addItem = useCart((s) => s.addItem);
  const setOpen = useCart((s) => s.setOpen);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (variety === "All" || p.variety === variety) &&
          (weight === "All" || p.weights.includes(weight as WeightOption)),
      ),
    [variety, weight],
  );

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-6 max-w-screen-2xl mx-auto">
        {/* Editorial header */}
        <header className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 z-10">
            <span className="inline-block px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
              Harvest Season 2024
            </span>
            <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter leading-tight mb-6 text-editorial-gradient">
              Pure Golden
              <br />
              Indulgence.
            </h1>
            <p className="text-lg text-on-surface-variant max-w-md leading-relaxed mb-8">
              Hand-picked at the peak of ripeness from the sun-drenched groves of Sindh. Experience the artisanal
              heritage of Royal Orchard.
            </p>
            <button
              onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-primary text-on-primary rounded-full font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Browse Collection
            </button>
          </div>
          <div className="lg:col-span-7 relative">
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-surface-container-low shadow-2xl relative">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz_Rv5_wd9vDrI4h58XmSfhYZghD1GZrWjgdbhXXJS3P8uKmPp4HULPSewShQmV-Ii6eftIMRvYzBuAzDW_6SPp8R9ST4M8KuYX0QILUhAxLtU9mCxMdjT51BRvdl2zdfKWptohN3WUVNa3QXeiEsZSIlqdQOd5v65BOAWJY38cv3HOAmzErRdUvNW_GXh9-gHobn4nTp9ajj27gez84f7Z7kJGFoeAKztH5chrNjpNHfJT5zOC7P0F7bHNjVOXB2xj0c0eg7Oqlpm"
                alt="Ripe yellow mangoes"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
            </div>
            <div className="hidden md:block absolute -bottom-12 -left-12 w-64 h-80 rounded-lg overflow-hidden shadow-xl border-8 border-surface transform -rotate-6">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv3CJi_8VFDrlb6kF-hdUwylBzavCfM7znd7Mzhfhldjaf-RNry-_E52AJS7J6xEqSkvVjVqMxpRfu8DJIvEQ6FMWfiIMDn11mW_waLztLsceyJ9czQhCXqJvjQ9l831sCd40ZPj53bcIHlqkFHKYe8MTV-IT8jmD-W5FgM525JZNzgPSj95I8zhXsbfS7VpVbSRxOVPEoCWYlfsqhzj5yB0PR0110t0BPTF1FlMIaQ2FVoP39v0A6L0vh2S_OM4hgI2aX1lNPXQA0"
                alt="Sliced mango"
              />
            </div>
          </div>
        </header>

        <div id="catalog" className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-72 space-y-10">
            <div className="lg:sticky lg:top-32">
              <h3 className="font-headline font-bold text-xl mb-6">Refine Selection</h3>
              <div className="space-y-8">
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
    className="bg-surface-container-lowest rounded-lg overflow-hidden group border border-transparent hover:border-primary-fixed/50 transition-all duration-500"
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
          <span className="text-xl font-bold text-primary">${p.price.toFixed(2)}</span>
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
      <span className="font-bold text-primary">${p.price.toFixed(2)}</span>
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
