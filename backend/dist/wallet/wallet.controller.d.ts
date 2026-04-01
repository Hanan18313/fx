import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWallet(req: any): Promise<import("../database/entities/wallet.entity").WalletEntity | {
        balance: number;
        frozen: number;
        totalEarn: number;
    }>;
    withdraw(req: any, amount: number, method: string): Promise<{
        message: string;
    }>;
    getBankCards(req: any): Promise<{
        data: import("../database/entities/bank-card.entity").BankCardEntity[];
    }>;
    getDefaultBankCard(req: any): Promise<import("../database/entities/bank-card.entity").BankCardEntity>;
    getTransactions(req: any, page?: number, limit?: number): Promise<{
        data: import("../database/entities/wallet-transaction.entity").WalletTransactionEntity[];
        total: number;
    }>;
}
