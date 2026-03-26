import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../database/entities/order.entity';
import { OrderItemEntity } from '../database/entities/order-item.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { UserEntity } from '../database/entities/user.entity';
import { AddressEntity } from '../database/entities/address.entity';
import { PromotionModule } from '../promotion/promotion.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ProductEntity, UserEntity, AddressEntity]),
    PromotionModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
