import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../../database/entities/order.entity';
import { OrderItemEntity } from '../../../database/entities/order-item.entity';
import { OrderMgmtController } from './order-mgmt.controller';
import { OrderMgmtService } from './order-mgmt.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])],
  controllers: [OrderMgmtController],
  providers: [OrderMgmtService],
})
export class OrderMgmtModule {}
