import { Repository, DataSource } from 'typeorm';
import { WalletEntity } from '../database/entities/wallet.entity';
import { WithdrawalEntity } from '../database/entities/withdrawal.entity';
import { BankCardEntity } from '../database/entities/bank-card.entity';
import { WalletTransactionEntity } from '../database/entities/wallet-transaction.entity';
export declare class WalletService {
    private readonly walletRepo;
    private readonly withdrawalRepo;
    private readonly bankCardRepo;
    private readonly transactionRepo;
    private readonly dataSource;
    constructor(walletRepo: Repository<WalletEntity>, withdrawalRepo: Repository<WithdrawalEntity>, bankCardRepo: Repository<BankCardEntity>, transactionRepo: Repository<WalletTransactionEntity>, dataSource: DataSource);
    getWallet(userId: number): Promise<WalletEntity | {
        balance: number;
        frozen: number;
        totalEarn: number;
    }>;
    withdraw(userId: number, amount: number, method?: string): Promise<{
        message: string;
    }>;
    getBankCards(userId: number): Promise<{
        data: BankCardEntity[];
    }>;
    getDefaultBankCard(userId: number): Promise<BankCardEntity>;
    getTransactions(userId: number, page?: number, limit?: number): Promise<{
        data: WalletTransactionEntity[];
        total: number;
    }>;
}
