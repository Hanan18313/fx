import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminJwtStrategy } from './admin-jwt.strategy';
import { SysAdminEntity } from '../../database/entities/sys-admin.entity';
import { SysAdminRoleEntity } from '../../database/entities/sys-admin-role.entity';
import { SysLoginLogEntity } from '../../database/entities/sys-login-log.entity';
import { TokenBlacklistService } from '../../common/services/token-blacklist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysAdminEntity, SysAdminRoleEntity, SysLoginLogEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'secret'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminJwtStrategy, TokenBlacklistService],
  exports: [JwtModule, AdminJwtStrategy],
})
export class AdminAuthModule {}
