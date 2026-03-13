import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../database/entities/user.entity';
import { WalletEntity } from '../database/entities/wallet.entity';
import { TokenBlacklistService } from '../common/services/token-blacklist.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

function genInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async register(dto: RegisterDto) {
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
    return { token, invite_code: inviteCode };
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
