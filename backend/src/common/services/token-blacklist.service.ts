import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';

const BLACKLIST_PREFIX = 'token:blacklist:';

@Injectable()
export class TokenBlacklistService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * 将 token 加入黑名单，TTL 为 token 剩余有效期
   */
  async addToBlacklist(token: string, expiresAt: number): Promise<void> {
    const ttl = expiresAt - Math.floor(Date.now() / 1000);
    if (ttl <= 0) return; // token 已过期，无需拉黑
    await this.redis.set(`${BLACKLIST_PREFIX}${token}`, '1', 'EX', ttl);
  }

  /**
   * 检查 token 是否在黑名单中
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.exists(`${BLACKLIST_PREFIX}${token}`);
    return result === 1;
  }
}
