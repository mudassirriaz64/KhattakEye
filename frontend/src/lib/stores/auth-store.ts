import { create } from "zustand";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string | null;
  gender: string;
  dateOfBirth: string;
  createdAt: string;
};

type AuthState = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  verifyEmail: (code: string) => Promise<boolean>;
  sendOTP: () => Promise<boolean>;
  verifyOTP: (code: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: "usr-001",
    fullName: "Ayesha Khan",
    email: "ayesha@example.com",
    phone: "+92 300 1234567",
    avatar: null,
    gender: "female",
    dateOfBirth: "1995-06-15",
    createdAt: "2026-01-10",
  },
  isAuthenticated: true,
  isLoading: false,
  isEmailVerified: true,

  login: async (_email, _password) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set({ isLoading: false, isAuthenticated: true, user: get().user });
    return true;
  },

  register: async (data) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    set({
      isLoading: false,
      isAuthenticated: true,
      isEmailVerified: false,
      user: { id: "usr-new", ...data, avatar: null, gender: "", dateOfBirth: "", createdAt: new Date().toISOString().split("T")[0] },
    });
    return true;
  },

  logout: () => set({ isAuthenticated: false, user: null }),

  updateProfile: (data) =>
    set((s) => ({ user: s.user ? { ...s.user, ...data } : null })),

  changePassword: async (_current, _new) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set({ isLoading: false });
    return true;
  },

  sendVerificationEmail: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ isLoading: false });
    return true;
  },

  verifyEmail: async (_code) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ isLoading: false, isEmailVerified: true });
    return true;
  },

  sendOTP: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ isLoading: false });
    return true;
  },

  verifyOTP: async (_code) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ isLoading: false, isEmailVerified: true });
    return true;
  },

  forgotPassword: async (_email) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set({ isLoading: false });
    return true;
  },

  resetPassword: async (_token, _password) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set({ isLoading: false });
    return true;
  },
}));
