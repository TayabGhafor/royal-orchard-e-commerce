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
      const res = await api<{ items: Product[] }>("/api/products?limit=200");
      set({ items: res.items, loading: false });
    } catch (e: any) {
      set({ error: e?.message || "Failed to load products", loading: false });
    }
  },
  findBySlug: (slug) => get().items.find((p) => p.slug === slug),
}));

