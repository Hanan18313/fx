import request from './request';

export const getMenuListApi = () => request.get('/admin/system/menus');
export const createMenuApi = (data: any) => request.post('/admin/system/menus', data);
export const updateMenuApi = (id: number, data: any) => request.put(`/admin/system/menus/${id}`, data);
export const deleteMenuApi = (id: number) => request.delete(`/admin/system/menus/${id}`);
