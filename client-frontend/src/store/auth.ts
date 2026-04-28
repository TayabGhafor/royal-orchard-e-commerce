import { create } from "zustand";
import { api, setAuthToken } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  address?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; role: "admin" | "customer"; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loadMe: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "address" | "phone" | "name">>) => Promise<void>;
  signOut: () => void;
  isAdmin: () => boolean;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  signIn: async (email, password) => {
    try {
      const res = await api<{ token: string; user: { id: string; name: string; email: string; role: "admin" | "customer" } }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) },
      );
      setAuthToken(res.token);
      set({ user: { ...res.user } });
      return { ok: true, role: res.user.role };
    } catch (e: any) {
      return { ok: false, role: "customer", error: e?.message || "Unable to sign in" };
    }
  },
  signUp: async (name, email, password) => {
    try {
      const res = await api<{ token: string; user: { id: string; name: string; email: string; role: "admin" | "customer" } }>(
        "/api/auth/register",
        { method: "POST", body: JSON.stringify({ name, email, password }) },
      );
      setAuthToken(res.token);
      set({ user: { ...res.user } });
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Unable to create account" };
    }
  },
  loadMe: async () => {
    try {
      const res = await api<{ user: any }>("/api/auth/me", { auth: true });
      const u = res.user;
      set({
        user: {
          id: String(u._id || u.id),
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone,
          address: u.address?.fullAddress || u.address,
        },
      });
    } catch {
      // token likely invalid/expired
      setAuthToken("");
      set({ user: null });
    }
  },
  updateProfile: async (patch) => {
    if (!get().user) return;
    const body: any = {};
    if (patch.name !== undefined) body.name = patch.name;
    if (patch.phone !== undefined) body.phone = patch.phone;
    if (patch.address !== undefined) body.address = { fullAddress: patch.address };
    const res = await api<{ user: any }>("/api/users/update", { method: "PUT", auth: true, body: JSON.stringify(body) });
    const u = res.user;
    set({
      user: {
        id: String(u._id || u.id),
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        address: u.address?.fullAddress || u.address,
      },
    });
  },
  signOut: () => {
    setAuthToken("");
    set({ user: null });
  },
  isAdmin: () => get().user?.role === "admin",
}));
