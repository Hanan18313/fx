import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenBlacklistService } from '../common/services/token-blacklist.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly tokenBlacklistService;
    constructor(config: ConfigService, tokenBlacklistService: TokenBlacklistService);
    validate(req: Request, payload: {
        id: number;
        role: string;
    }): Promise<{
        id: number;
        role: string;
    }>;
}
export {};
