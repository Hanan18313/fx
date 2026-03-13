import request from './request';

export const getUserListApi = (params?: any) => request.get('/admin/users', { params });
export const updateUserApi = (id: number, data: any) => request.patch(`/admin/users/${id}`, data);
