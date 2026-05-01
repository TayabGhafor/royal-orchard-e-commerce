import { create } from "zustand";
import { api, setAuthToken } from "@/lib/api";

const REMEMBER_EMAIL_KEY = "royalorchard-remember-email";

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
  signIn: (
    email: string,
    password: string,
    remember?: boolean,
  ) => Promise<{ ok: boolean; role: "admin" | "customer"; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loadMe: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<User, "address" | "phone" | "name">>) => Promise<void>;
  signOut: () => void;
  isAdmin: () => boolean;
  getRememberedEmail: () => string;
  forgotPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
  verifyResetCode: (email: string, code: string) => Promise<{ ok: boolean; resetToken?: string; error?: string }>;
  resetPasswordWithToken: (
    resetToken: string,
    password: string,
    confirmPassword: string,
  ) => Promise<{ ok: boolean; error?: string }>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  getRememberedEmail: () => {
    try {
      return localStorage.getItem(REMEMBER_EMAIL_KEY) || "";
    } catch {
      return "";
    }
  },
  signIn: async (email, password, remember = true) => {
    try {
      const res = await api<{ token: string; user: { id: string; name: string; email: string; role: "admin" | "customer" } }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) },
      );
      setAuthToken(res.token, remember ? "local" : "session");
      try {
        if (remember) localStorage.setItem(REMEMBER_EMAIL_KEY, email);
        else localStorage.removeItem(REMEMBER_EMAIL_KEY);
      } catch {
        // ignore
      }
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

  forgotPassword: async (email) => {
    try {
      await api<{ ok?: boolean; message?: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return { ok: true };
    } catch (e: unknown) {
      const err = e as { message?: string };
      return { ok: false, error: err?.message || "Unable to send reset code" };
    }
  },

  verifyResetCode: async (email, code) => {
    try {
      const res = await api<{ resetToken: string }>("/api/auth/verify-reset-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      return { ok: true, resetToken: res.resetToken };
    } catch (e: unknown) {
      const err = e as { message?: string };
      return { ok: false, error: err?.message || "Verification failed" };
    }
  },

  resetPasswordWithToken: async (resetToken, password, confirmPassword) => {
    try {
      await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ resetToken, password, confirmPassword }),
      });
      return { ok: true };
    } catch (e: unknown) {
      const err = e as { message?: string };
      return { ok: false, error: err?.message || "Unable to update password" };
    }
  },
}));
