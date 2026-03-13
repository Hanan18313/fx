import { DataSource } from 'typeorm';
export declare class DashboardService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getStats(): Promise<{
        totalUsers: number;
        todayNewUsers: number;
        totalOrders: number;
        todayOrders: number;
        totalRevenue: number;
        pendingWithdrawals: number;
    }>;
}
