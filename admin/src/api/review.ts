import request from './request';

export const getReviewListApi = (params?: any) => request.get('/admin/reviews', { params });
export const deleteReviewApi = (id: number) => request.delete(`/admin/reviews/${id}`);
