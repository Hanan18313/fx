import { WithdrawalMgmtService } from './withdrawal-mgmt.service';
export declare class WithdrawalMgmtController {
    private readonly withdrawalMgmtService;
    constructor(withdrawalMgmtService: WithdrawalMgmtService);
    list(page?: number, pageSize?: number, status?: string, userId?: string): Promise<{
        list: {
            userPhone: any;
            id: number;
            userId: number;
            amount: number;
            bankName: string;
            bankAccount: string;
            realName: string;
            status: string;
            rejectReason: string;
            appliedAt: Date;
            processedAt: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    approve(id: number): Promise<{
        message: string;
    }>;
    reject(id: number, rejectReason: string): Promise<{
        message: string;
    }>;
}
