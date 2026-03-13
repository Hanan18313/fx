import { Repository, DataSource } from 'typeorm';
import { WalletEntity } from '../database/entities/wallet.entity';
import { WithdrawalEntity } from '../database/entities/withdrawal.entity';
export declare class WalletService {
    private readonly walletRepo;
    private readonly withdrawalRepo;
    private readonly dataSource;
    constructor(walletRepo: Repository<WalletEntity>, withdrawalRepo: Repository<WithdrawalEntity>, dataSource: DataSource);
    getWallet(userId: number): Promise<WalletEntity | {
        balance: number;
        frozen: number;
        totalEarn: number;
    }>;
    withdraw(userId: number, amount: number): Promise<{
        message: string;
    }>;
    getTransactions(userId: number): Promise<{
        data: any[];
    }>;
}
