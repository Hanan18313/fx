export declare class WithdrawalEntity {
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
}
