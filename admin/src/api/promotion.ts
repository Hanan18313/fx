import request from './request';

export const getPromotionOverviewApi = () =>
  request.get('/admin/promotion/overview');

export const getPromotionRewardsApi = (params?: any) =>
  request.get('/admin/promotion/rewards', { params });

export const getPromotionConfigApi = () =>
  request.get('/admin/promotion/config');

export const updatePromotionConfigApi = (data: any) =>
  request.put('/admin/promotion/config', data);
