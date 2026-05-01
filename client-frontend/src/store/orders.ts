import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Returned"
  | "Cancelled";

export interface StoreOrder {
  id: string;
  customer: string;
  email: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  address: string;
  createdAt: string;
  paid?: boolean;
  reviewed?: boolean;
  paymentMethod?: string;
}

export interface StoreCustomer {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  orders: number;
  spent: number;
  joinedAt: string;
}

interface OrdersState {
  orders: StoreOrder[];
  customers: StoreCustomer[];
  loadOrders: () => Promise<void>;
  addOrderLocal: (
    order: Omit<StoreOrder, "id" | "createdAt" | "status"> & { status?: OrderStatus },
  ) => StoreOrder;
  setOrderStatusLocal: (id: string, status: OrderStatus) => void;
  upsertCustomerLocal: (customer: { name: string; email: string; spent: number }) => void;
}

const seedOrders: StoreOrder[] = [];
const seedCustomers: StoreCustomer[] = [];

// De-dupe + throttle order fetches across the whole storefront app.
let myOrdersInFlight: Promise<void> | null = null;
let lastMyOrdersFetchAt = 0;
const MY_ORDERS_STALE_MS = 30_000;

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: seedOrders,
      customers: seedCustomers,
      loadOrders: async () => {
        const now = Date.now();
        if (myOrdersInFlight) return myOrdersInFlight;
        if (now - lastMyOrdersFetchAt < MY_ORDERS_STALE_MS) return;

        myOrdersInFlight = (async () => {
          try {
            const res = await api<{ items: any[] }>("/api/orders/my-orders", { auth: true });
            const mapped: StoreOrder[] = res.items.map((o) => {
              const total = Number(o?.pricing?.total || 0);
              const qty = Array.isArray(o?.items)
                ? o.items.reduce((n: number, it: any) => n + Number(it.quantity || 0), 0)
                : 0;
              const first = Array.isArray(o?.items) && o.items[0] ? o.items[0] : null;
              const productSummary = first ? `${first.title || "Order"} (${first.weight || ""}kg)` : "Order";
              const statusMap: Record<string, OrderStatus> = {
                Placed: "Pending",
                Processing: "Processing",
                Shipped: "Shipped",
                Delivered: "Delivered",
                Cancelled: "Cancelled",
                Returned: "Returned",
              };
              const status: OrderStatus = statusMap[o.orderStatus] || "Pending";
              return {
                id: String(o._id || o.id || ""),
                customer: o?.deliveryDetails?.name || o?.guest?.name || "Customer",
                email: o?.guest?.email || "",
                product: productSummary,
                quantity: qty,
                total,
                status,
                address: o?.deliveryDetails?.address || "",
                createdAt: o?.createdAt || new Date().toISOString(),
                paid: o?.paymentStatus === "Paid",
                paymentMethod: o?.paymentMethod,
              };
            });
            set({ orders: mapped });
            lastMyOrdersFetchAt = Date.now();
          } finally {
            myOrdersInFlight = null;
          }
        })();

        return myOrdersInFlight;
      },
      addOrderLocal: (input) => {
        const order: StoreOrder = {
          ...input,
          id: `RO-${Math.floor(1000 + Math.random() * 9000)}`,
          status: input.status ?? "Pending",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },
      setOrderStatusLocal: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order,
          ),
        })),
      upsertCustomerLocal: ({ name, email, spent }) =>
        set((state) => {
          const idx = state.customers.findIndex(
            (customer) => customer.email.toLowerCase() === email.toLowerCase(),
          );
          if (idx === -1) {
            const customer: StoreCustomer = {
              id: `C-${String(state.customers.length + 1).padStart(3, "0")}`,
              name,
              email,
              status: "Active",
              orders: 1,
              spent,
              joinedAt: new Date().toISOString().slice(0, 10),
            };
            return { customers: [customer, ...state.customers] };
          }

          const customers = [...state.customers];
          const existing = customers[idx];
          customers[idx] = {
            ...existing,
            name: name || existing.name,
            status: "Active",
            orders: existing.orders + 1,
            spent: existing.spent + spent,
          };
          return { customers };
        }),
    }),
    { name: "royalorchard-orders" },
  ),
);
