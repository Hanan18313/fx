import request from './request';

export const getDeptListApi = () => request.get('/admin/system/depts');
export const createDeptApi = (data: any) => request.post('/admin/system/depts', data);
export const updateDeptApi = (id: number, data: any) => request.put(`/admin/system/depts/${id}`, data);
export const deleteDeptApi = (id: number) => request.delete(`/admin/system/depts/${id}`);
