import request from './request';

export const loginApi = (data: { username: string; password: string }) =>
  request.post('/admin/auth/login', data);

export const getProfileApi = () =>
  request.get('/admin/auth/profile');

export const logoutApi = (data: { id: number; username: string }) =>
  request.post('/admin/auth/logout', data);
