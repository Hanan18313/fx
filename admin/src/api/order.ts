import request from './request';

export const getOrderListApi = (params?: any) => request.get('/admin/orders', { params });
export const getOrderDetailApi = (id: number) => request.get(`/admin/orders/${id}`);
export const updateOrderStatusApi = (id: number, data: { status: string }) =>
  request.patch(`/admin/orders/${id}/status`, data);
