import { DataSource } from 'typeorm';
import { ProfitEngineService } from './profit-engine.service';
export declare class ProfitReleaseJob {
    private readonly dataSource;
    private readonly engine;
    private readonly logger;
    constructor(dataSource: DataSource, engine: ProfitEngineService);
    handleProfitRelease(): Promise<void>;
}
