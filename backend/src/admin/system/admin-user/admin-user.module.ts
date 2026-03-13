import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysAdminEntity } from '../../../database/entities/sys-admin.entity';
import { SysAdminRoleEntity } from '../../../database/entities/sys-admin-role.entity';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysAdminEntity, SysAdminRoleEntity])],
  controllers: [AdminUserController],
  providers: [AdminUserService],
  exports: [AdminUserService],
})
export class AdminUserModule {}
