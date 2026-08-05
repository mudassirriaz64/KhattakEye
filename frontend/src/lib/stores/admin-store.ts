import { create } from "zustand";
import { adminLoginApi, adminLogoutApi, adminGetProfileApi } from "../api/admin";

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
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  toggleSidebar: () => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  sidebarCollapsed: false,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const data = await adminGetProfileApi();
      if (data && data.user) {
        set({
          user: data.user,
          isAuthenticated: true
        });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await adminLoginApi(email, password);
      set({
        isAuthenticated: true,
        user: data.user
      });
      return true;
    } catch (err) {
      console.error("Admin login failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await adminLogoutApi();
    } catch (err) {
      console.error("Admin logout failed:", err);
    } finally {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
