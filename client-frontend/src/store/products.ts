import { create } from "zustand";
import type { Product } from "@/data/products";
import { api } from "@/lib/api";

type ProductsState = {
  items: Product[];
  loading: boolean;
  error: string | null;
  loadedOnce: boolean;
  load: () => Promise<void>;
  findBySlug: (slug: string) => Product | undefined;
};

export const useProducts = create<ProductsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  loadedOnce: false,
  load: async () => {
    // De-dupe + throttle product fetches across the whole app.
    // Prevents hammering the backend if a component accidentally calls `load()` repeatedly.
    const now = Date.now();
    const state = get();
    const inFlight = (state as any).__inFlight as Promise<void> | undefined;
    const lastFetchAt = Number((state as any).__lastFetchAt || 0);
    const STALE_MS = 60_000;
    if (inFlight) return inFlight;
    if (now - lastFetchAt < STALE_MS && state.items.length > 0) return;

    const p = (async () => {
      set({ loading: true, error: null });
      (get() as any).__lastFetchAt = Date.now();
      try {
        const candidates = [
          "/api/products?limit=200&active=true",
          "/api/products?limit=200",
          "/api/v1/products?limit=200",
          "/api/v1/products",
        ];

        let rawItems: any[] | null = null;
        let lastErr: unknown = null;

        for (const path of candidates) {
          try {
            // eslint-disable-next-line no-await-in-loop
            const res: any = await api<any>(path);
            const items =
              (Array.isArray(res?.items) && res.items) ||
              (Array.isArray(res?.data?.items) && res.data.items) ||
              (Array.isArray(res?.data?.data?.items) && res.data.data.items) ||
              null;
            if (items) {
              rawItems = items;
              break;
            }
          } catch (e) {
            lastErr = e;
          }
        }

        if (!rawItems) {
          throw lastErr || new Error("Failed to load products");
        }

        const mapped: Product[] = rawItems.map((raw) => ({
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
        set({ items: mapped, loading: false, loadedOnce: true });
      } catch (e: any) {
        set({ error: e?.message || "Failed to load products", loading: false, loadedOnce: true });
      } finally {
        (get() as any).__inFlight = undefined;
      }
    })();

    (get() as any).__inFlight = p;
    return p;
  },
  findBySlug: (slug) => get().items.find((p) => p.slug === slug),
}));

