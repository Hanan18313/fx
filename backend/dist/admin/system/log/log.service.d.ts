import { Repository } from 'typeorm';
import { SysOperationLogEntity } from '../../../database/entities/sys-operation-log.entity';
import { SysLoginLogEntity } from '../../../database/entities/sys-login-log.entity';
export declare class LogService {
    private readonly operationLogRepo;
    private readonly loginLogRepo;
    constructor(operationLogRepo: Repository<SysOperationLogEntity>, loginLogRepo: Repository<SysLoginLogEntity>);
    listOperationLogs(query: {
        page?: number;
        pageSize?: number;
        module?: string;
        action?: string;
        adminName?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        list: SysOperationLogEntity[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    listLoginLogs(query: {
        page?: number;
        pageSize?: number;
        username?: string;
        status?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        list: SysLoginLogEntity[];
        total: number;
        page: number;
        pageSize: number;
    }>;
}
