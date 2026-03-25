import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '../database/entities/order.entity';
import { OrderItemEntity } from '../database/entities/order-item.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { UserEntity } from '../database/entities/user.entity';
import { PromotionService } from '../promotion/promotion.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly promotionService: PromotionService,
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      let totalAmount = 0;
      let profitPool = 0;
      const itemsToSave: OrderItemEntity[] = [];

      for (const item of dto.items) {
        const product = await manager.findOne(ProductEntity, {
          where: { id: item.product_id, status: 'on' },
        });
        if (!product) throw new BadRequestException(`商品 ${item.product_id} 不存在`);
        if (product.stock < item.quantity) throw new BadRequestException(`商品 ${product.name} 库存不足`);

        const subtotal = Number(product.price) * item.quantity;
        totalAmount += subtotal;
        profitPool += subtotal * Number(product.profitRate);

        const orderItem = manager.create(OrderItemEntity, {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal,
        });
        itemsToSave.push(orderItem);
      }

      const order = manager.create(OrderEntity, {
        userId,
        totalAmount: +totalAmount.toFixed(2),
        profitPool: +profitPool.toFixed(2),
      });
      const savedOrder = await manager.save(order);

      for (const item of itemsToSave) {
        item.orderId = savedOrder.id;
      }
      await manager.save(itemsToSave);

      return {
        order_id: savedOrder.id,
        total_amount: savedOrder.totalAmount,
        profit_pool: savedOrder.profitPool,
      };
    });
  }

  async payOrder(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId, status: 'pending' },
    });
    if (!order) throw new NotFoundException('订单不存在或已支付');

    await this.dataSource.transaction(async (manager) => {
      await manager.update(OrderEntity, orderId, { status: 'done', paidAt: new Date() });

      const user = await this.userRepo.findOne({ where: { id: userId }, select: ['parentId'] });
      if (user?.parentId) {
        await this.promotionService.grantCommission(
          user.parentId, userId, orderId, Number(order.profitPool), manager,
        );
      }
    });

    return { message: '支付成功，分润将从明日起每天自动释放' };
  }

  async getOrders(userId: number) {
    const data = await this.orderRepo.find({
      where: { userId },
      select: ['id', 'totalAmount', 'profitPool', 'status', 'paidAt', 'createdAt'],
      order: { id: 'DESC' },
    });
    return { data };
  }
}
