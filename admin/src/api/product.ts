import request from './request';

export const getProductListApi = (params?: any) => request.get('/admin/products', { params });
export const createProductApi = (data: any) => request.post('/admin/products', data);
export const updateProductApi = (id: number, data: any) => request.put(`/admin/products/${id}`, data);
export const toggleProductStatusApi = (id: number) => request.patch(`/admin/products/${id}/status`);
