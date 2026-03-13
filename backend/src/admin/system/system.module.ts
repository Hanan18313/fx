import { Module } from '@nestjs/common';
import { AdminUserModule } from './admin-user/admin-user.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { DeptModule } from './dept/dept.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [AdminUserModule, RoleModule, MenuModule, DeptModule, LogModule],
})
export class SystemModule {}
