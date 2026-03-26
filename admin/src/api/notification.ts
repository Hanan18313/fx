import request from './request';

export const getNotificationListApi = (params?: any) => request.get('/admin/notifications', { params });
export const createNotificationApi = (data: any) => request.post('/admin/notifications', data);
export const deleteNotificationApi = (id: number) => request.delete(`/admin/notifications/${id}`);
