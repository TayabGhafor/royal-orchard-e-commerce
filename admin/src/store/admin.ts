import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seedProducts, type Product, type WeightOption } from "@/data/products";

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

export interface AdminProduct extends Product {
  stock: number;
}

interface AdminState {
  products: AdminProduct[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  // Products
  addProduct: (p: Omit<AdminProduct, "id" | "slug">) => void;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  // Orders
  setOrderStatus: (id: string, status: OrderStatus) => void;
  addOrder: (o: Omit<AdminOrder, "id" | "createdAt" | "status"> & { status?: OrderStatus }) => AdminOrder;
  upsertCustomer: (c: { name: string; email: string; spent: number }) => void;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `prod-${Date.now()}`;

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

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      products: seedProducts.map((p) => ({ ...p, stock: 50 })),
      orders: seedOrders,
      customers: seedCustomers,
      addProduct: (p) =>
        set((state) => {
          const id = `prod-${Date.now()}`;
          return { products: [{ ...p, id, slug: slugify(p.name) }, ...state.products] };
        }),
      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      setOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      addOrder: (o) => {
        const order: AdminOrder = {
          ...o,
          id: `RO-${Math.floor(1000 + Math.random() * 9000)}`,
          status: o.status ?? "Pending",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
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
  price: number;
  weights: WeightOption[];
  images: string[];
  variety: AdminProduct["variety"];
  collection: AdminProduct["collection"];
  stock: number;
  rating: number;
  reviews: number;
};
