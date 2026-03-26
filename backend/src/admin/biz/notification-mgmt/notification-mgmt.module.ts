import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '../../../database/entities/notification.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { NotificationMgmtController } from './notification-mgmt.controller';
import { NotificationMgmtService } from './notification-mgmt.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, UserEntity])],
  controllers: [NotificationMgmtController],
  providers: [NotificationMgmtService],
})
export class NotificationMgmtModule {}
