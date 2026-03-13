import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWallet(req: any): Promise<import("../database/entities/wallet.entity").WalletEntity | {
        balance: number;
        frozen: number;
        totalEarn: number;
    }>;
    withdraw(req: any, amount: number): Promise<{
        message: string;
    }>;
    getTransactions(req: any): Promise<{
        data: any[];
    }>;
}
