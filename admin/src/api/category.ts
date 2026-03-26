import request from './request';

export const getCategoryListApi = () => request.get('/admin/categories');
export const createCategoryApi = (data: any) => request.post('/admin/categories', data);
export const updateCategoryApi = (id: number, data: any) => request.put(`/admin/categories/${id}`, data);
export const deleteCategoryApi = (id: number) => request.delete(`/admin/categories/${id}`);
