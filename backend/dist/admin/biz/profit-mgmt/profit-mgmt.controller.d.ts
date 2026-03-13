import { ProfitMgmtService } from './profit-mgmt.service';
export declare class ProfitMgmtController {
    private readonly profitMgmtService;
    constructor(profitMgmtService: ProfitMgmtService);
    stats(): Promise<{
        totalProfit: number;
        todayProfit: number;
        personalProfit: number;
        teamProfit: number;
        topEarners: any;
    }>;
}
