import request from './request';

export const getOperationLogsApi = (params?: any) => request.get('/admin/system/logs/operations', { params });
export const getLoginLogsApi = (params?: any) => request.get('/admin/system/logs/logins', { params });
