import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { PromotionConfigEntity } from '../database/entities/promotion-config.entity';
import { REDIS_CLIENT } from '../common/redis/redis.module';

const CACHE_PREFIX = 'promo:config:';
const CACHE_TTL = 300; // 5 minutes

@Injectable()
export class PromotionConfigService {
  constructor(
    @InjectRepository(PromotionConfigEntity)
    private readonly configRepo: Repository<PromotionConfigEntity>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async getConfig(key: string): Promise<string | null> {
    const cached = await this.redis.get(`${CACHE_PREFIX}${key}`);
    if (cached !== null) return cached;

    const row = await this.configRepo.findOne({ where: { configKey: key } });
    if (!row) return null;

    await this.redis.set(`${CACHE_PREFIX}${key}`, row.configValue, 'EX', CACHE_TTL);
    return row.configValue;
  }

  async getNumberConfig(key: string, fallback: number): Promise<number> {
    const val = await this.getConfig(key);
    if (val === null) return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  }

  async getBoolConfig(key: string, fallback: boolean): Promise<boolean> {
    const val = await this.getConfig(key);
    if (val === null) return fallback;
    return val === 'true';
  }

  async setConfig(key: string, value: string): Promise<void> {
    await this.configRepo.upsert(
      { configKey: key, configValue: value },
      ['configKey'],
    );
    await this.redis.del(`${CACHE_PREFIX}${key}`);
  }

  async getAllConfigs(): Promise<Record<string, string>> {
    const rows = await this.configRepo.find();
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.configKey] = row.configValue;
    }
    return map;
  }
}
