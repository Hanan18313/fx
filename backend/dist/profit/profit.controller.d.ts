import { ProfitService } from './profit.service';
export declare class ProfitController {
    private readonly profitService;
    constructor(profitService: ProfitService);
    getDashboard(req: any): Promise<{
        released_total: any;
        today_amount: any;
        pending_total: any;
    }>;
    getRecords(req: any): Promise<{
        data: import("../database/entities/profit-record.entity").ProfitRecordEntity[];
    }>;
    getTeamProfit(req: any): Promise<{
        team_profit_total: any;
    }>;
}
