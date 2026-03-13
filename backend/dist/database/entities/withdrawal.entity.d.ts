export declare class WithdrawalEntity {
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
}
