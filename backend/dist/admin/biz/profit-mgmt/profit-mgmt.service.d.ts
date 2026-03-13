import { DataSource } from 'typeorm';
export declare class ProfitMgmtService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getStats(): Promise<{
        totalProfit: number;
        todayProfit: number;
        personalProfit: number;
        teamProfit: number;
        topEarners: any;
    }>;
}
