import request from './request';

export const getProfitStatsApi = () => request.get('/admin/profit/stats');
