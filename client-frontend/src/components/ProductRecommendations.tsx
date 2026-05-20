import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchChatRecommendations, type ChatProduct } from "@/lib/chat-api";
import { formatPKR } from "@/lib/format";
import { useProducts } from "@/store/products";
import { ScrollReveal } from "@/components/ScrollReveal";

type Section = "forYou" | "similar" | "trending" | "alsoBought" | "recent";

const TITLES: Record<Section, string> = {
  forYou: "Recommended For You",
  similar: "Similar Products",
  trending: "Trending Now",
  alsoBought: "Customers Also Bought",
  recent: "Recently Viewed",
};

type Props = {
  section: Section;
  productId?: string;
  className?: string;
};

export function ProductRecommendations({ section, productId, className }: Props) {
  const [products, setProducts] = useState<ChatProduct[]>([]);
  const items = useProducts((s) => s.items);

  useEffect(() => {
    let cancelled = false;
    void fetchChatRecommendations(section, productId)
      .then((res) => {
        if (!cancelled) setProducts(res.products || []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [section, productId]);

  if (!products.length) return null;

  const slugFor = (p: ChatProduct) => {
    const local = items.find((i) => i.id === p.id);
    return local?.slug || p.slug;
  };

  return (
    <ScrollReveal as="section" variant="fade-up" duration={0.85} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-background mb-6">
          {TITLES[section]}
        </h2>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Link
                to={`/product/${slugFor(p)}`}
                className="block min-w-[260px] bg-surface-container-low rounded-lg p-5 border border-outline-variant/15 card-hover shine-on-hover"
              >
                <p className="font-headline font-bold text-on-surface">{p.name}</p>
                <p className="text-sm text-outline mt-1">{p.variety}</p>
                <p className="text-primary font-bold mt-3">{formatPKR(p.minPrice)}</p>
                <p className="text-xs text-outline mt-1">{p.availabilityStatus}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
