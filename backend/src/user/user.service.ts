import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../database/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'phone', 'nickname', 'avatar', 'role', 'inviteCode', 'memberNo', 'memberExpire', 'createdAt'],
    });
    if (!user) throw new NotFoundException('用户不存在');

    const maskedPhone = user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    return {
      id: user.id,
      phone: maskedPhone,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role,
      memberNo: user.memberNo,
      memberExpire: user.memberExpire,
      invite_code: user.inviteCode,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const updateData: Partial<UserEntity> = {};
    if (dto.nickname !== undefined) updateData.nickname = dto.nickname;
    if (dto.avatar !== undefined) updateData.avatar = dto.avatar;

    await this.userRepo.update(userId, updateData);
    return { message: '更新成功' };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });
    if (!user) throw new NotFoundException('用户不存在');

    const match = await bcrypt.compare(dto.oldPassword, user.password);
    if (!match) throw new BadRequestException('原密码错误');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.update(userId, { password: hashed });
    return { message: '密码修改成功' };
  }
}
