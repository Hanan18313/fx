import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '../../../database/entities/review.entity';
import { ProductEntity } from '../../../database/entities/product.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { ReviewMgmtController } from './review-mgmt.controller';
import { ReviewMgmtService } from './review-mgmt.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, ProductEntity, UserEntity])],
  controllers: [ReviewMgmtController],
  providers: [ReviewMgmtService],
})
export class ReviewMgmtModule {}
