import request from './request';

export const getBannerListApi = () => request.get('/admin/banners');
export const createBannerApi = (data: any) => request.post('/admin/banners', data);
export const updateBannerApi = (id: number, data: any) => request.put(`/admin/banners/${id}`, data);
export const deleteBannerApi = (id: number) => request.delete(`/admin/banners/${id}`);
