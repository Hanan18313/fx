import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionRewardEntity } from '../database/entities/promotion-reward.entity';
import { PromotionConfigEntity } from '../database/entities/promotion-config.entity';
import { UserEntity } from '../database/entities/user.entity';
import { WalletEntity } from '../database/entities/wallet.entity';
import { PromotionService } from './promotion.service';
import { PromotionConfigService } from './promotion-config.service';
import { PromotionController } from './promotion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromotionRewardEntity,
      PromotionConfigEntity,
      UserEntity,
      WalletEntity,
    ]),
  ],
  controllers: [PromotionController],
  providers: [PromotionService, PromotionConfigService],
  exports: [PromotionService, PromotionConfigService],
})
export class PromotionModule {}
