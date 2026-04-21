import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MockUser {
  name: string;
  email: string;
  role?: "admin" | "customer";
  address?: string;
  phone?: string;
}

interface StoredAccount {
  name: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
}

interface AuthState {
  user: MockUser | null;
  accounts: StoredAccount[];
  signIn: (email: string, password: string) => { ok: boolean; role: "admin" | "customer"; error?: string };
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => { ok: boolean; error?: string };
  updateProfile: (patch: Partial<Pick<MockUser, "address" | "phone" | "name">>) => void;
  signOut: () => void;
  isAdmin: () => boolean;
}

const ADMIN_EMAIL = "royalorchard@admin.com";
const ADMIN_PASSWORD = "Royalorchard@admin";

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],
      signIn: (email, password) => {
        const em = email.trim().toLowerCase();
        if (em === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ user: { name: "Admin", email: ADMIN_EMAIL, role: "admin" } });
          return { ok: true, role: "admin" };
        }
        const acct = get().accounts.find((a) => a.email.toLowerCase() === em);
        if (!acct) return { ok: false, role: "customer", error: "No account found. Please sign up first." };
        if (acct.password !== password) return { ok: false, role: "customer", error: "Incorrect password." };
        set({
          user: {
            name: acct.name,
            email: acct.email,
            role: "customer",
            address: acct.address,
            phone: acct.phone,
          },
        });
        return { ok: true, role: "customer" };
      },
      signUp: (name, email, password) => {
        const em = email.trim().toLowerCase();
        if (em === ADMIN_EMAIL) return { ok: false, error: "This email is reserved." };
        const exists = get().accounts.some((a) => a.email.toLowerCase() === em);
        if (exists) return { ok: false, error: "An account with this email already exists." };
        const account: StoredAccount = { name: name || em.split("@")[0], email: em, password };
        set((state) => ({
          accounts: [...state.accounts, account],
          user: { name: account.name, email: account.email, role: "customer" },
        }));
        return { ok: true };
      },
      updateProfile: (patch) =>
        set((state) => {
          if (!state.user) return state;
          const user = { ...state.user, ...patch };
          const accounts = state.accounts.map((a) =>
            a.email.toLowerCase() === state.user!.email.toLowerCase() ? { ...a, ...patch } : a,
          );
          return { user, accounts };
        }),
      signOut: () => set({ user: null }),
      isAdmin: () => get().user?.role === "admin",
    }),
    { name: "royalorchard-auth" },
  ),
);
