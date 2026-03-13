import request from './request';

export const getAdminListApi = (params?: any) => request.get('/admin/system/admins', { params });
export const createAdminApi = (data: any) => request.post('/admin/system/admins', data);
export const updateAdminApi = (id: number, data: any) => request.put(`/admin/system/admins/${id}`, data);
export const resetPasswordApi = (id: number, data: { password: string }) =>
  request.patch(`/admin/system/admins/${id}/reset-password`, data);
