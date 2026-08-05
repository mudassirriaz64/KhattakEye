import api from './axios';

export const adminLoginApi = async (email: string, password: string) => {
  const response = await api.post('/admin/auth/login', { email, password });
  return response.data;
};

export const adminLogoutApi = async () => {
  const response = await api.post('/admin/auth/logout');
  return response.data;
};

export const adminGetProfileApi = async () => {
  const response = await api.get('/admin/auth/me');
  return response.data;
};
