import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendSmsDto } from './dto/send-sms.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendSms(dto: SendSmsDto): Promise<{
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
    logout(req: Request): Promise<{
        message: string;
    }>;
}
