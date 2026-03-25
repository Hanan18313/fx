import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { PromotionConfigEntity } from '../database/entities/promotion-config.entity';
export declare class PromotionConfigService {
    private readonly configRepo;
    private readonly redis;
    constructor(configRepo: Repository<PromotionConfigEntity>, redis: Redis);
    getConfig(key: string): Promise<string | null>;
    getNumberConfig(key: string, fallback: number): Promise<number>;
    getBoolConfig(key: string, fallback: boolean): Promise<boolean>;
    setConfig(key: string, value: string): Promise<void>;
    getAllConfigs(): Promise<Record<string, string>>;
}
