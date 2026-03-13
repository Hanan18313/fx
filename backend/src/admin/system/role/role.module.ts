import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysRoleEntity } from '../../../database/entities/sys-role.entity';
import { SysRoleMenuEntity } from '../../../database/entities/sys-role-menu.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysRoleEntity, SysRoleMenuEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
