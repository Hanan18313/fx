import { Repository, DataSource } from 'typeorm';
import { WithdrawalEntity } from '../../../database/entities/withdrawal.entity';
import { WalletEntity } from '../../../database/entities/wallet.entity';
export declare class WithdrawalMgmtService {
    private readonly withdrawalRepo;
    private readonly walletRepo;
    private readonly dataSource;
    constructor(withdrawalRepo: Repository<WithdrawalEntity>, walletRepo: Repository<WalletEntity>, dataSource: DataSource);
    list(params: {
        page: number;
        pageSize: number;
        status?: string;
        userId?: number;
    }): Promise<{
        list: {
            userPhone: any;
            id: number;
            userId: number;
            amount: number;
            method: string;
            bankCardId: number;
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
