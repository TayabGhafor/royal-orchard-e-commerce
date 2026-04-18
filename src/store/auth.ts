import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MockUser {
  name: string;
  email: string;
}

interface AuthState {
  user: MockUser | null;
  signIn: (email: string, _password: string) => void;
  signUp: (name: string, email: string, _password: string) => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (email) => set({ user: { name: email.split("@")[0] || "Friend", email } }),
      signUp: (name, email) => set({ user: { name: name || email.split("@")[0], email } }),
      signOut: () => set({ user: null }),
    }),
    { name: "royalorchard-auth" },
  ),
);
