import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { TokenBlacklistService } from '../../common/services/token-blacklist.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    config: ConfigService,
    private readonly dataSource: DataSource,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET', 'secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { id: number; username: string; type: string }) {
    if (payload.type !== 'admin') {
      return null;
    }

    // 检查 token 是否已被拉黑
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (token && await this.tokenBlacklistService.isBlacklisted(token)) {
      return null;
    }

    const rows = await this.dataSource.query(
      `SELECT a.id, a.username, a.dept_id AS deptId, r.code AS roleCode
       FROM sys_admin a
       LEFT JOIN sys_admin_role ar ON ar.admin_id = a.id
       LEFT JOIN sys_role r ON r.id = ar.role_id AND r.status = 1
       WHERE a.id = ? AND a.status = 1 AND a.deleted_at IS NULL`,
      [payload.id],
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    const admin = rows[0];
    const roleCodes = rows
      .map((r: any) => r.roleCode)
      .filter((code: string | null) => code !== null);

    return {
      id: Number(admin.id),
      username: admin.username,
      deptId: Number(admin.deptId),
      roleCodes,
    };
  }
}
