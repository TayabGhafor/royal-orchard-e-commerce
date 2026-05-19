import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WeightOption } from "@/data/products";
import { unitPriceForWeight } from "@/lib/productPricing";
import { displayUrlForProductImage } from "@/lib/productImages";
import { trackProductCartAdd } from "@/lib/product-analytics";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  weight: WeightOption;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, weight: WeightOption, quantity?: number) => void;
  removeItem: (productId: string, weight: WeightOption) => void;
  updateQuantity: (productId: string, weight: WeightOption, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, weight, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id && i.weight === weight,
          );
          if (existing) {
            trackProductCartAdd(product.id, quantity);
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          trackProductCartAdd(product.id, quantity);
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                image: displayUrlForProductImage(product.images[0]),
                unitPrice: unitPriceForWeight(product, weight),
                weight,
                quantity,
              },
            ],
          };
        }),
      removeItem: (productId, weight) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.weight === weight),
          ),
        })),
      updateQuantity: (productId, weight, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId && i.weight === weight
                ? { ...i, quantity: Math.max(0, quantity) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    }),
    { name: "royalorchard-cart" },
  ),
);
