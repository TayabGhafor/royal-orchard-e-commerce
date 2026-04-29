import { create } from "zustand";
import type { Product } from "@/data/products";
import { api } from "@/lib/api";

type ProductsState = {
  items: Product[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  findBySlug: (slug: string) => Product | undefined;
};

export const useProducts = create<ProductsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  load: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api<{ items: any[] }>("/api/products?limit=200");
      const mapped: Product[] = res.items.map((raw) => ({
        id: String(raw._id || raw.id),
        slug: raw.slug,
        name: raw.name,
        tagline: raw.tagline,
        description: raw.description,
        price: Number(raw.price),
        variety: raw.variety,
        collection: raw.collection,
        weights: Array.isArray(raw.weights) ? raw.weights : [],
        badge: raw.badge,
        images: Array.isArray(raw.images) ? raw.images : [],
        rating: Number(raw.rating ?? 0),
        reviews: Number(raw.reviews ?? 0),
      }));
      set({ items: mapped, loading: false });
    } catch (e: any) {
      set({ error: e?.message || "Failed to load products", loading: false });
    }
  },
  findBySlug: (slug) => get().items.find((p) => p.slug === slug),
}));

