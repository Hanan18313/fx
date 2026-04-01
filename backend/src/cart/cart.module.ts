import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from '../database/entities/cart-item.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity, ProductEntity])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
