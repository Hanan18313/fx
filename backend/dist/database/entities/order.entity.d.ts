export declare class OrderEntity {
    id: number;
    orderNo: string;
    userId: number;
    totalAmount: number;
    freightAmount: number;
    discountAmount: number;
    payAmount: number;
    profitPool: number;
    status: string;
    payType: string;
    payTradeNo: string;
    remark: string;
    addressId: number;
    addressSnapshot: any;
    paidAt: Date;
    shippedAt: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
