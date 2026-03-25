import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      import('../stores/useAuthStore').then(({ useAuthStore }) => {
        useAuthStore.getState().reset();
      });
      window.location.href = '/login';
      return Promise.reject(error);
    }
    const msg = error.response?.data?.message || '请求失败';
    message.error(Array.isArray(msg) ? msg[0] : msg);
    return Promise.reject(error);
  },
);

export default request;
