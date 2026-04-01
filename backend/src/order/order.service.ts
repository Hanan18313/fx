import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrderEntity } from '../database/entities/order.entity';
import { OrderItemEntity } from '../database/entities/order-item.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { UserEntity } from '../database/entities/user.entity';
import { AddressEntity } from '../database/entities/address.entity';
import { PromotionService } from '../promotion/promotion.service';
import { CreateOrderDto } from './dto/create-order.dto';

function generateOrderNo(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return 'ORD' + Date.now() + random;
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepo: Repository<AddressEntity>,
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

        const productImage = product.images && product.images.length > 0 ? product.images[0] : null;
        const orderItem = manager.create(OrderItemEntity, {
          productId: product.id,
          productName: product.name,
          productImage,
          price: product.price,
          quantity: item.quantity,
          subtotal,
        });
        itemsToSave.push(orderItem);
      }

      let addressSnapshot = null;
      let addressId = null;
      if (dto.address_id) {
        const address = await manager.findOne(AddressEntity, {
          where: { id: dto.address_id, userId },
        });
        if (address) {
          addressId = address.id;
          addressSnapshot = {
            name: address.name,
            phone: address.phone,
            province: address.province,
            city: address.city,
            district: address.district,
            detail: address.detail,
          };
        }
      }

      const freightAmount = 0;
      const discountAmount = 0;
      const payAmount = +(totalAmount + freightAmount - discountAmount).toFixed(2);

      const order = manager.create(OrderEntity, {
        orderNo: generateOrderNo(),
        userId,
        totalAmount: +totalAmount.toFixed(2),
        profitPool: +profitPool.toFixed(2),
        freightAmount,
        discountAmount,
        payAmount,
        remark: dto.remark || null,
        addressId,
        addressSnapshot,
      });
      const savedOrder = await manager.save(order);

      for (const item of itemsToSave) {
        item.orderId = savedOrder.id;
      }
      await manager.save(itemsToSave);

      return {
        id: savedOrder.id,
        payAmount: savedOrder.payAmount,
        totalAmount: savedOrder.totalAmount,
      };
    });
  }

  async payOrder(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId, status: 'pending' },
    });
    if (!order) throw new NotFoundException('订单不存在或已支付');

    await this.dataSource.transaction(async (manager) => {
      await manager.update(OrderEntity, orderId, { status: 'paid', paidAt: new Date() });

      const user = await this.userRepo.findOne({ where: { id: userId }, select: ['parentId'] });
      if (user?.parentId) {
        await this.promotionService.grantCommission(
          user.parentId, userId, orderId, Number(order.profitPool), manager,
        );
      }
    });

    return { payAmount: order.payAmount, totalAmount: order.totalAmount };
  }

  async getOrders(userId: number, status?: string, page = 1, limit = 20) {
    const where: any = { userId };
    if (status) where.status = status;

    const [orders, total] = await this.orderRepo.findAndCount({
      where,
      select: ['id', 'orderNo', 'totalAmount', 'payAmount', 'profitPool', 'status', 'paidAt', 'createdAt'],
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (orders.length === 0) return { data: [], total, page };

    const orderIds = orders.map((o) => o.id);
    const items = await this.orderItemRepo
      .createQueryBuilder('item')
      .where('item.order_id IN (:...ids)', { ids: orderIds })
      .getMany();

    const itemMap = new Map<number, OrderItemEntity[]>();
    for (const item of items) {
      const list = itemMap.get(item.orderId) || [];
      list.push(item);
      itemMap.set(item.orderId, list);
    }

    const data = orders.map((order) => ({
      ...order,
      items: itemMap.get(order.id) || [],
    }));

    return { data, total, page };
  }

  async getOrderDetail(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException('订单不存在');

    const items = await this.orderItemRepo.find({
      where: { orderId },
    });

    return { ...order, items };
  }

  async cancelOrder(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException('订单不存在');
    if (order.status !== 'pending') throw new BadRequestException('只能取消待支付订单');

    await this.orderRepo.update(orderId, { status: 'cancelled' });
    return { message: '订单已取消' };
  }

  async confirmOrder(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException('订单不存在');
    if (order.status !== 'shipped') throw new BadRequestException('只能确认已发货订单');

    await this.orderRepo.update(orderId, { status: 'done', completedAt: new Date() });
    return { message: '确认收货成功' };
  }
}
