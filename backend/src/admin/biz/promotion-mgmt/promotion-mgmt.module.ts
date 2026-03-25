import { Module } from '@nestjs/common';
import { PromotionModule } from '../../../promotion/promotion.module';
import { PromotionMgmtController } from './promotion-mgmt.controller';
import { PromotionMgmtService } from './promotion-mgmt.service';

@Module({
  imports: [PromotionModule],
  controllers: [PromotionMgmtController],
  providers: [PromotionMgmtService],
})
export class PromotionMgmtModule {}
