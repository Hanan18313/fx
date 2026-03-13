import request from './request';

export const getRoleListApi = (params?: any) => request.get('/admin/system/roles', { params });
export const createRoleApi = (data: any) => request.post('/admin/system/roles', data);
export const updateRoleApi = (id: number, data: any) => request.put(`/admin/system/roles/${id}`, data);
export const assignMenusApi = (id: number, data: { menuIds: number[] }) =>
  request.put(`/admin/system/roles/${id}/menus`, data);
