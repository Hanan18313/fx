import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../database/entities/user.entity';
import { WalletEntity } from '../database/entities/wallet.entity';
import { SmsCodeEntity } from '../database/entities/sms-code.entity';
import { TokenBlacklistService } from '../common/services/token-blacklist.service';
import { PromotionService } from '../promotion/promotion.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly walletRepo;
    private readonly smsCodeRepo;
    private readonly jwtService;
    private readonly tokenBlacklistService;
    private readonly promotionService;
    private readonly logger;
    constructor(userRepo: Repository<UserEntity>, walletRepo: Repository<WalletEntity>, smsCodeRepo: Repository<SmsCodeEntity>, jwtService: JwtService, tokenBlacklistService: TokenBlacklistService, promotionService: PromotionService);
    sendSmsCode(phone: string): Promise<{
        code: string;
    }>;
    register(dto: RegisterDto): Promise<{
        token: string;
        role: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        role: string;
    }>;
    logout(token: string): Promise<void>;
}
