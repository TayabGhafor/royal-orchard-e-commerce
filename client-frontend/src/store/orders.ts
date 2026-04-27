import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  addOrder: (
    order: Omit<StoreOrder, "id" | "createdAt" | "status"> & { status?: OrderStatus },
  ) => StoreOrder;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  upsertCustomer: (customer: { name: string; email: string; spent: number }) => void;
}

const seedOrders: StoreOrder[] = [
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
];

const seedCustomers: StoreCustomer[] = [
  { id: "C-001", name: "Amara Vance", email: "amara@example.com", status: "Active", orders: 14, spent: 62800, joinedAt: "2024-01-12" },
  { id: "C-002", name: "Julian Ricci", email: "julian@example.com", status: "Active", orders: 8, spent: 31200, joinedAt: "2024-02-04" },
  { id: "C-003", name: "Elena Vance", email: "elena@example.com", status: "Active", orders: 22, spent: 88600, joinedAt: "2023-11-23" },
];

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: seedOrders,
      customers: seedCustomers,
      addOrder: (input) => {
        const order: StoreOrder = {
          ...input,
          id: `RO-${Math.floor(1000 + Math.random() * 9000)}`,
          status: input.status ?? "Pending",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },
      setOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order,
          ),
        })),
      upsertCustomer: ({ name, email, spent }) =>
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
