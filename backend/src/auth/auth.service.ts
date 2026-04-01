import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../database/entities/user.entity';
import { WalletEntity } from '../database/entities/wallet.entity';
import { SmsCodeEntity } from '../database/entities/sms-code.entity';
import { TokenBlacklistService } from '../common/services/token-blacklist.service';
import { PromotionService } from '../promotion/promotion.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

function genInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    @InjectRepository(SmsCodeEntity)
    private readonly smsCodeRepo: Repository<SmsCodeEntity>,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly promotionService: PromotionService,
  ) {}

  async sendSmsCode(phone: string) {
    // 将该手机号已有未过期验证码标记为已使用
    await this.smsCodeRepo
      .createQueryBuilder()
      .update()
      .set({ used: 1 })
      .where('phone = :phone AND used = 0 AND expired_at > NOW()', { phone })
      .execute();

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.smsCodeRepo.save(
      this.smsCodeRepo.create({ phone, code, scene: 'register', used: 0, expiredAt }),
    );

    // 开发环境直接返回验证码，生产环境调用短信 SDK 后返回 {}
    this.logger.log(`短信验证码 [${phone}]: ${code}`);
    return { code };
  }

  async register(dto: RegisterDto) {
    const smsCode = await this.smsCodeRepo.findOne({
      where: { phone: dto.phone, scene: 'register', used: 0 },
      order: { createdAt: 'DESC' },
    });
    if (!smsCode || smsCode.code !== dto.code || smsCode.expiredAt < new Date()) {
      throw new BadRequestException('验证码无效或已过期');
    }
    await this.smsCodeRepo.update(smsCode.id, { used: 1 });

    const existing = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (existing) throw new BadRequestException('该手机号已注册');

    let parentId: number = null;
    if (dto.invite_code) {
      const parent = await this.userRepo.findOne({ where: { inviteCode: dto.invite_code } });
      if (parent) parentId = parent.id;
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const inviteCode = genInviteCode();

    const user = this.userRepo.create({
      phone: dto.phone,
      password: hashed,
      inviteCode,
      parentId,
    });
    const saved = await this.userRepo.save(user);

    // 初始化钱包
    await this.walletRepo.save(this.walletRepo.create({ userId: saved.id }));

    const token = this.jwtService.sign({ id: saved.id, role: saved.role });

    if (parentId) {
      this.promotionService
        .grantReferralReward(parentId, saved.id)
        .catch((err) => this.logger.error('邀请奖励发放异常', err));
    }

    return { token, role: saved.role };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (!user) throw new UnauthorizedException('手机号或密码错误');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('手机号或密码错误');

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { token, role: user.role };
  }

  async logout(token: string) {
    const decoded = this.jwtService.decode(token) as { exp: number };
    if (decoded?.exp) {
      await this.tokenBlacklistService.addToBlacklist(token, decoded.exp);
    }
  }
}
