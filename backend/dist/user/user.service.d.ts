import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UserService {
    private readonly userRepo;
    constructor(userRepo: Repository<UserEntity>);
    getProfile(userId: number): Promise<{
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
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<{
        message: string;
    }>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
