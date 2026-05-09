import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Product, type ProductAvailability, type WeightOption } from "@/data/products";
import { api } from "@/lib/api";
import { normalizeImagesFromRaw, type ProductImage } from "@/lib/productImages";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Returned"
  | "Cancelled";

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  product: string;
  quantity: number;
  total: number; // PKR
  status: OrderStatus;
  address: string;
  createdAt: string; // ISO
  paid?: boolean;
  reviewed?: boolean;
  paymentMethod?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  orders: number;
  spent: number; // PKR
  joinedAt: string; // ISO
}

export type AdminProduct = Product;

const envApi = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE =
  envApi !== undefined && envApi !== ""
    ? envApi
    : import.meta.env.DEV
      ? ""
      : "http://localhost:5000";

function toAbsoluteImageUrl(src: string) {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) return `${API_BASE}${src}`;
  return `${API_BASE}/${src}`;
}

function normalizeProductImagesFromApi(raw: unknown): ProductImage[] {
  return normalizeImagesFromRaw(raw).map((e) => ({
    fileId: e.fileId,
    url: toAbsoluteImageUrl(e.url),
  }));
}

function normalizeWeightPrices(product: any): Partial<Record<WeightOption, number>> {
  const wp = product.weightPrices;
  const out: Partial<Record<WeightOption, number>> = {};
  if (wp && typeof wp === "object") {
    (["3kg", "5kg", "8kg"] as const).forEach((k) => {
      const v = Number(wp[k]);
      if (Number.isFinite(v) && v > 0) out[k] = v;
    });
  }
  if (Object.keys(out).length > 0) return out;
  const legacy = Number(product.price);
  const weights = Array.isArray(product.weights) ? product.weights : [];
  if (Number.isFinite(legacy) && legacy > 0) {
    for (const w of weights) {
      if (w === "3kg" || w === "5kg" || w === "8kg") out[w] = legacy;
    }
  }
  return out;
}

function normalizeAvailability(product: any): ProductAvailability {
  if (product.availabilityStatus === "In Stock" || product.availabilityStatus === "Out of Stock") {
    return product.availabilityStatus;
  }
  return Number(product.stock) > 0 ? "In Stock" : "Out of Stock";
}

function normalizeProductShape(product: any): AdminProduct {
  return {
    id: String(product.id || product._id || ""),
    slug: String(product.slug || ""),
    name: String(product.name || ""),
    tagline: String(product.tagline || ""),
    description: String(product.description || ""),
    weightPrices: normalizeWeightPrices(product),
    availabilityStatus: normalizeAvailability(product),
    variety: product.variety,
    collection: product.collection,
    weights: Array.isArray(product.weights) ? product.weights : ["3kg", "5kg", "8kg"],
    rating: Number(product.rating || 0),
    reviews: Number(product.reviews || 0),
    badge: product.badge,
    images: normalizeProductImagesFromApi(product.images),
  };
}

interface AdminState {
  products: AdminProduct[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  // Products
  loadProducts: () => Promise<void>;
  addProduct: (p: Omit<AdminProduct, "id" | "slug">) => Promise<AdminProduct>;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => Promise<AdminProduct>;
  deleteProduct: (id: string) => Promise<void>;
  // Orders
  loadOrders: () => Promise<void>;
  setOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  upsertCustomer: (c: { name: string; email: string; spent: number }) => void;
}

type BackendOrderStatus = "Placed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

function mapBackendStatus(s: BackendOrderStatus | string): OrderStatus {
  if (s === "Placed") return "Pending";
  if (s === "Processing") return "Processing";
  if (s === "Shipped") return "Shipped";
  if (s === "Delivered") return "Delivered";
  if (s === "Cancelled") return "Cancelled";
  if (s === "Returned") return "Returned";
  return "Pending";
}

function mapUiStatusToBackend(s: OrderStatus): BackendOrderStatus {
  if (s === "Pending") return "Placed";
  if (s === "Processing") return "Processing";
  if (s === "Shipped") return "Shipped";
  if (s === "Delivered") return "Delivered";
  if (s === "Cancelled") return "Cancelled";
  if (s === "Returned") return "Returned";
  return "Placed";
}

function shortId(id: string) {
  const s = String(id || "");
  return s.length > 8 ? s.slice(-8) : s;
}

const seedOrders: AdminOrder[] = [
  {
    id: "RO-1234",
    customer: "Amara Vance",
    email: "amara@example.com",
    product: "Sindhri Honey Gold (5kg)",
    quantity: 1,
    total: 4500,
    status: "Pending",
    address: "Apt 4, Clifton Block 2, Karachi",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "RO-1235",
    customer: "Julian Ricci",
    email: "julian@example.com",
    product: "Anwar Ratol Special (3kg)",
    quantity: 2,
    total: 10400,
    status: "Shipped",
    address: "DHA Phase 6, Lahore",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "RO-1236",
    customer: "Elena Vance",
    email: "elena@example.com",
    product: "Chaunsa Delight (8kg)",
    quantity: 1,
    total: 3800,
    status: "Delivered",
    address: "F-7 Markaz, Islamabad",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "RO-1237",
    customer: "Hassan Ali",
    email: "hassan@example.com",
    product: "Sindhri Bulk Crate (8kg)",
    quantity: 1,
    total: 6500,
    status: "Pending",
    address: "Bahria Town, Rawalpindi",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "RO-1238",
    customer: "Sara Ahmed",
    email: "sara@example.com",
    product: "Langra Green (5kg)",
    quantity: 3,
    total: 9600,
    status: "Delivered",
    address: "Gulberg III, Lahore",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

const seedCustomers: AdminCustomer[] = [
  { id: "C-001", name: "Amara Vance", email: "amara@example.com", status: "Active", orders: 14, spent: 62800, joinedAt: "2024-01-12" },
  { id: "C-002", name: "Julian Ricci", email: "julian@example.com", status: "Active", orders: 8, spent: 31200, joinedAt: "2024-02-04" },
  { id: "C-003", name: "Elena Vance", email: "elena@example.com", status: "Active", orders: 22, spent: 88600, joinedAt: "2023-11-23" },
  { id: "C-004", name: "Hassan Ali", email: "hassan@example.com", status: "Active", orders: 3, spent: 14200, joinedAt: "2024-04-19" },
  { id: "C-005", name: "Sara Ahmed", email: "sara@example.com", status: "Inactive", orders: 1, spent: 3200, joinedAt: "2024-03-02" },
];

// De-dupe + throttle order fetches across the whole admin app.
// This prevents backend overload even if a component accidentally calls `loadOrders()` repeatedly.
let ordersInFlight: Promise<void> | null = null;
let lastOrdersFetchAt = 0;
const ORDERS_STALE_MS = 30_000;

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      products: [],
      orders: seedOrders,
      customers: seedCustomers,
      loadProducts: async () => {
        const res = await api<{ items: any[] }>("/api/products?limit=50");
        set({ products: res.items.map((p) => normalizeProductShape(p)) });
      },
      addProduct: async (p) => {
        const res = await api<{ product: any }>("/api/products", {
          method: "POST",
          admin: true,
          body: JSON.stringify(p),
        });
        const next = normalizeProductShape(res.product);
        set((state) => ({ products: [next, ...state.products] }));
        return next;
      },
      updateProduct: async (id, patch) => {
        const res = await api<{ product: any }>(`/api/products/${id}`, {
          method: "PUT",
          admin: true,
          body: JSON.stringify(patch),
        });
        const next = normalizeProductShape(res.product);
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? next : p)),
        }));
        return next;
      },
      deleteProduct: async (id) => {
        await api<{ ok: true }>(`/api/products/${id}`, { method: "DELETE", admin: true });
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },
      loadOrders: async () => {
        const now = Date.now();
        if (ordersInFlight) return ordersInFlight;
        if (now - lastOrdersFetchAt < ORDERS_STALE_MS) return;

        ordersInFlight = (async () => {
          try {
            const res = await api<{ items: any[] }>("/api/orders?limit=50", { admin: true });
            const mapped: AdminOrder[] = res.items.map((o) => {
              const total = Number(o?.pricing?.total || 0);
              const qty = Array.isArray(o?.items) ? o.items.reduce((n: number, it: any) => n + Number(it.quantity || 0), 0) : 0;
              const first = Array.isArray(o?.items) && o.items[0] ? o.items[0] : null;
              const productSummary = first ? `${first.title || "Order"} (${first.weight || ""}kg)` : "Order";
              const customer = o?.deliveryDetails?.name || o?.guest?.name || "Customer";
              const email = o?.guest?.email || "—";
              return {
                id: String(o._id || o.id || ""),
                customer,
                email,
                product: productSummary,
                quantity: qty,
                total,
                status: mapBackendStatus(o.orderStatus),
                address: o?.deliveryDetails?.address || "",
                createdAt: o?.createdAt || new Date().toISOString(),
                paid: o?.paymentStatus === "Paid",
                paymentMethod: o?.paymentMethod,
              };
            });
            set({ orders: mapped });
            lastOrdersFetchAt = Date.now();
          } finally {
            ordersInFlight = null;
          }
        })();

        return ordersInFlight;
      },
      setOrderStatus: async (id, status) => {
        const backendStatus = mapUiStatusToBackend(status);
        await api<{ order: any }>(`/api/orders/${id}/status`, {
          method: "PUT",
          admin: true,
          body: JSON.stringify({ status: backendStatus }),
        });
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }));
      },
      upsertCustomer: ({ name, email, spent }) =>
        set((state) => {
          const idx = state.customers.findIndex(
            (c) => c.email.toLowerCase() === email.toLowerCase(),
          );
          if (idx === -1) {
            const newC: AdminCustomer = {
              id: `C-${String(state.customers.length + 1).padStart(3, "0")}`,
              name,
              email,
              status: "Active",
              orders: 1,
              spent,
              joinedAt: new Date().toISOString().slice(0, 10),
            };
            return { customers: [newC, ...state.customers] };
          }
          const updated = [...state.customers];
          const existing = updated[idx];
          updated[idx] = {
            ...existing,
            name: name || existing.name,
            status: "Active",
            orders: existing.orders + 1,
            spent: existing.spent + spent,
          };
          return { customers: updated };
        }),
    }),
    { name: "royalorchard-admin" },
  ),
);

// Helper used by the Add Product form
export type NewProductInput = {
  name: string;
  description: string;
  tagline: string;
  weightPrices: Partial<Record<WeightOption, number>>;
  weights: WeightOption[];
  images: ProductImage[];
  variety: AdminProduct["variety"];
  collection: AdminProduct["collection"];
  availabilityStatus: ProductAvailability;
  rating: number;
  reviews: number;
};
