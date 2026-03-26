import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from '../../../database/entities/banner.entity';
import { BannerMgmtController } from './banner-mgmt.controller';
import { BannerMgmtService } from './banner-mgmt.service';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  controllers: [BannerMgmtController],
  providers: [BannerMgmtService],
})
export class BannerMgmtModule {}
