import api from './axios';
import { UserProfile } from '../stores/auth-store';

export const loginApi = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerApi = async (data: { fullName: string; email: string; phone: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfileApi = async (data: Partial<UserProfile>) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export const changePasswordApi = async (currentPassword: string, newPassword: string) => {
  const response = await api.put('/auth/change-password', { currentPassword, newPassword });
  return response.data;
};

export const sendOtpApi = async () => {
  const response = await api.post('/auth/send-otp');
  return response.data;
};

export const verifyOtpApi = async (code: string) => {
  const response = await api.post('/auth/verify-otp', { code });
  return response.data;
};

export const forgotPasswordApi = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPasswordApi = async (token: string, password: string) => {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
};
