import request from './request';

export const getDashboardApi = () => request.get('/admin/dashboard');
