import request from './request';

export const getWithdrawalListApi = (params?: any) => request.get('/admin/withdrawals', { params });
export const approveWithdrawalApi = (id: number) => request.post(`/admin/withdrawals/${id}/approve`);
export const rejectWithdrawalApi = (id: number, data: { rejectReason: string }) =>
  request.post(`/admin/withdrawals/${id}/reject`, data);
