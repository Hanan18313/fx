import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module';
import { SystemModule } from './system/system.module';
import { BizModule } from './biz/biz.module';

@Module({
  imports: [AdminAuthModule, SystemModule, BizModule],
})
export class AdminModule {}
