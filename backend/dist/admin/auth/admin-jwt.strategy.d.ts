import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { TokenBlacklistService } from '../../common/services/token-blacklist.service';
declare const AdminJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    private readonly dataSource;
    private readonly tokenBlacklistService;
    constructor(config: ConfigService, dataSource: DataSource, tokenBlacklistService: TokenBlacklistService);
    validate(req: Request, payload: {
        id: number;
        username: string;
        type: string;
    }): Promise<{
        id: number;
        username: any;
        deptId: number;
        roleCodes: any;
    }>;
}
export {};
