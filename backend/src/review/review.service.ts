import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../database/entities/review.entity';
import { OrderEntity } from '../database/entities/order.entity';
import { UserEntity } from '../database/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(userId: number, dto: CreateReviewDto) {
    const order = await this.orderRepo.findOne({
      where: { id: dto.order_id, userId },
    });
    if (!order) throw new BadRequestException('订单不存在');
    if (order.status !== 'done') throw new BadRequestException('订单未完成，无法评价');

    const existing = await this.reviewRepo.findOne({
      where: { userId, orderId: dto.order_id, productId: dto.product_id },
    });
    if (existing) throw new BadRequestException('已评价过该商品');

    const review = this.reviewRepo.create({
      userId,
      productId: dto.product_id,
      orderId: dto.order_id,
      rating: dto.rating ?? 5,
      content: dto.content,
      images: dto.images,
      isAnonymous: dto.is_anonymous ?? 0,
    });
    const saved = await this.reviewRepo.save(review);
    return saved;
  }

  async getProductReviews(productId: number, page = 1, limit = 20) {
    const [reviews, total] = await this.reviewRepo.findAndCount({
      where: { productId },
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (reviews.length === 0) return { data: [], total, page };

    const userIds = [...new Set(reviews.map((r) => r.userId))];
    const users = await this.userRepo
      .createQueryBuilder('u')
      .where('u.id IN (:...ids)', { ids: userIds })
      .select(['u.id', 'u.nickname', 'u.avatar', 'u.phone'])
      .getMany();

    const userMap = new Map(users.map((u) => [u.id, u]));

    const data = reviews.map((r) => {
      const user = userMap.get(r.userId);
      let nickname = '匿名用户';
      let avatar = null;
      if (user && r.isAnonymous !== 1) {
        nickname = user.nickname || user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        avatar = user.avatar;
      }
      return {
        id: r.id,
        rating: r.rating,
        content: r.content,
        images: r.images,
        nickname,
        avatar,
        created_at: r.createdAt,
      };
    });

    return { data, total, page };
  }
}
