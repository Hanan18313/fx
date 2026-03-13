import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenBlacklistService } from '../common/services/token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET', 'secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { id: number; role: string }) {
    // 检查 token 是否已被拉黑
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (token && await this.tokenBlacklistService.isBlacklisted(token)) {
      return null;
    }

    return { id: payload.id, role: payload.role };
  }
}
