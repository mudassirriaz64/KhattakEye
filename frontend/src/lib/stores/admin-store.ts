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
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
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
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password, rememberMe) => {
    set({ isLoading: true });
    try {
      const data = await adminLoginApi(email, password, rememberMe);
      set({
        isAuthenticated: true,
        user: data.user
      });
      return { success: true };
    } catch (err) {
      console.error("Admin login failed:", err);
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMsg = apiErr?.response?.data?.message || apiErr?.message || "Invalid admin credentials";
      return { success: false, error: errorMsg };
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
