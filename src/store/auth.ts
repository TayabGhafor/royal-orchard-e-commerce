import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MockUser {
  name: string;
  email: string;
  role?: "admin" | "customer";
}

interface AuthState {
  user: MockUser | null;
  signIn: (email: string, password: string) => { ok: boolean; role: "admin" | "customer" };
  signUp: (name: string, email: string, _password: string) => void;
  signOut: () => void;
  isAdmin: () => boolean;
}

const ADMIN_EMAIL = "royalorchard@admin.com";
const ADMIN_PASSWORD = "Royalorchard@admin";

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      signIn: (email, password) => {
        if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ user: { name: "Admin", email: ADMIN_EMAIL, role: "admin" } });
          return { ok: true, role: "admin" };
        }
        set({ user: { name: email.split("@")[0] || "Friend", email, role: "customer" } });
        return { ok: true, role: "customer" };
      },
      signUp: (name, email) =>
        set({ user: { name: name || email.split("@")[0], email, role: "customer" } }),
      signOut: () => set({ user: null }),
      isAdmin: () => get().user?.role === "admin",
    }),
    { name: "royalorchard-auth" },
  ),
);
