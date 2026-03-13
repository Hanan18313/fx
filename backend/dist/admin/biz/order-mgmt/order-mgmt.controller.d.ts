import { OrderMgmtService } from './order-mgmt.service';
export declare class OrderMgmtController {
    private readonly orderMgmtService;
    constructor(orderMgmtService: OrderMgmtService);
    list(page?: number, pageSize?: number, status?: string, userId?: string, startDate?: string, endDate?: string): Promise<{
        list: {
            userPhone: any;
            userNickname: any;
            id: number;
            userId: number;
            totalAmount: number;
            profitPool: number;
            status: string;
            payType: string;
            payTradeNo: string;
            remark: string;
            paidAt: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    detail(id: number): Promise<{
        items: import("../../../database/entities/order-item.entity").OrderItemEntity[];
        id: number;
        userId: number;
        totalAmount: number;
        profitPool: number;
        status: string;
        payType: string;
        payTradeNo: string;
        remark: string;
        paidAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: number, status: string): Promise<{
        message: string;
    }>;
}
