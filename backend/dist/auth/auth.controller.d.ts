import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        token: string;
        invite_code: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        role: string;
    }>;
    logout(req: Request): Promise<{
        message: string;
    }>;
}
