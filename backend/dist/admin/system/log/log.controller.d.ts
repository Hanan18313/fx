import { LogService } from './log.service';
export declare class LogController {
    private readonly logService;
    constructor(logService: LogService);
    listOperationLogs(page?: number, pageSize?: number, module?: string, action?: string, adminName?: string, startDate?: string, endDate?: string): Promise<{
        list: import("../../../database/entities/sys-operation-log.entity").SysOperationLogEntity[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    listLoginLogs(page?: number, pageSize?: number, username?: string, status?: number, startDate?: string, endDate?: string): Promise<{
        list: import("../../../database/entities/sys-login-log.entity").SysLoginLogEntity[];
        total: number;
        page: number;
        pageSize: number;
    }>;
}
