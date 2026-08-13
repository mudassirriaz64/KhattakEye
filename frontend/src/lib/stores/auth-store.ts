import { create } from "zustand";
import {
  loginApi,
  registerApi,
  logoutApi,
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
  sendOtpApi,
  verifyOtpApi,
  forgotPasswordApi,
  resetPasswordApi
} from "../api/auth";

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
  checkAuth: () => Promise<void>;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  register: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  verifyEmail: (code: string) => Promise<boolean>;
  sendOTP: () => Promise<boolean>;
  verifyOTP: (code: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isEmailVerified: false,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const data = await getProfileApi();
      if (data && data.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isEmailVerified: data.user.isEmailVerified
        });
      } else {
        set({ user: null, isAuthenticated: false, isEmailVerified: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isEmailVerified: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password, rememberMe) => {
    set({ isLoading: true });
    try {
      const data = await loginApi(email, password, rememberMe);
      set({
        isAuthenticated: true,
        user: data.user,
        isEmailVerified: data.user.isEmailVerified
      });
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await registerApi(data);
      set({
        isAuthenticated: true,
        isEmailVerified: false,
        user: res.user
      });
      return true;
    } catch (err) {
      console.error("Registration failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({ isAuthenticated: false, user: null, isEmailVerified: false, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await updateProfileApi(data);
      set({ user: res.user });
      return true;
    } catch (err) {
      console.error("Update profile failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true });
    try {
      await changePasswordApi(currentPassword, newPassword);
      return true;
    } catch (err) {
      console.error("Change password failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // verifyEmail and verifyOTP both wire to the verifyOtp backend handler
  sendVerificationEmail: async () => {
    set({ isLoading: true });
    try {
      await sendOtpApi();
      return true;
    } catch (err) {
      console.error("Send verification email failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true });
    try {
      const res = await verifyOtpApi(code);
      set({ isEmailVerified: true, user: res.user });
      return true;
    } catch (err) {
      console.error("Verify email failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  sendOTP: async () => {
    set({ isLoading: true });
    try {
      await sendOtpApi();
      return true;
    } catch (err) {
      console.error("Send OTP failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOTP: async (code) => {
    set({ isLoading: true });
    try {
      const res = await verifyOtpApi(code);
      set({ isEmailVerified: true, user: res.user });
      return true;
    } catch (err) {
      console.error("Verify OTP failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      await forgotPasswordApi(email);
      return true;
    } catch (err) {
      console.error("Forgot password request failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true });
    try {
      await resetPasswordApi(token, password);
      return true;
    } catch (err) {
      console.error("Reset password failed:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
