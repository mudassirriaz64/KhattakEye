import { create } from "zustand";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "super-admin" | "admin" | "manager";
};

type AdminState = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sidebarCollapsed: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleSidebar: () => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  user: {
    id: "admin-001",
    name: "Admin Khattak",
    email: "admin@khattak.com",
    avatar: null,
    role: "super-admin",
  },
  isAuthenticated: true,
  isLoading: false,
  sidebarCollapsed: false,

  login: async (_email, _password) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set({ isLoading: false, isAuthenticated: true });
    return true;
  },

  logout: () => set({ isAuthenticated: false, user: null }),

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
