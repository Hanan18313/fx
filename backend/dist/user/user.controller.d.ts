import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<{
        id: number;
        phone: string;
        nickname: string;
        avatar: string;
        role: string;
        memberNo: string;
        memberExpire: string;
        invite_code: string;
        createdAt: Date;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        message: string;
    }>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
