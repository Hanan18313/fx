import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { UserMgmtController } from './user-mgmt.controller';
import { UserMgmtService } from './user-mgmt.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserMgmtController],
  providers: [UserMgmtService],
})
export class UserMgmtModule {}
