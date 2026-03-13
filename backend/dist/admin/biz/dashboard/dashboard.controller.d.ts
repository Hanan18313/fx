import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        totalUsers: number;
        todayNewUsers: number;
        totalOrders: number;
        todayOrders: number;
        totalRevenue: number;
        pendingWithdrawals: number;
    }>;
}
