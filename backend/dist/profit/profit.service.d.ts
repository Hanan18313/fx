import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { ProfitRecordEntity } from '../database/entities/profit-record.entity';
export declare class ProfitService {
    private readonly recordRepo;
    private readonly dataSource;
    constructor(recordRepo: Repository<ProfitRecordEntity>, dataSource: DataSource);
    getDashboard(userId: number): Promise<{
        released_total: any;
        today_amount: any;
        pending_total: any;
    }>;
    getRecords(userId: number): Promise<{
        data: ProfitRecordEntity[];
    }>;
    getTeamProfit(userId: number): Promise<{
        team_profit_total: any;
    }>;
}
