import Redis from 'ioredis';
export declare class TokenBlacklistService {
    private readonly redis;
    constructor(redis: Redis);
    addToBlacklist(token: string, expiresAt: number): Promise<void>;
    isBlacklisted(token: string): Promise<boolean>;
}
