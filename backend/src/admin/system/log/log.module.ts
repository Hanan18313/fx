import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysOperationLogEntity } from '../../../database/entities/sys-operation-log.entity';
import { SysLoginLogEntity } from '../../../database/entities/sys-login-log.entity';
import { LogController } from './log.controller';
import { LogService } from './log.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysOperationLogEntity, SysLoginLogEntity])],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
