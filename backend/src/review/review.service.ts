import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    private readonly dataSource: DataSource,
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
      isAnonymous: dto.anonymous ? 1 : 0,
    });
    await this.reviewRepo.save(review);
    return {};
  }

  async getStats(productId?: number) {
    const sql = `SELECT
         COALESCE(AVG(rating), 0)                                              AS avgRating,
         COUNT(*)                                                               AS total,
         SUM(CASE WHEN images IS NOT NULL AND images != '[]' THEN 1 ELSE 0 END) AS withImage,
         SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END)                          AS positive,
         SUM(has_followup)                                                      AS withFollowup
       FROM reviews
       ${productId ? 'WHERE product_id = ?' : ''}`;
    const params = productId ? [productId] : [];
    const [row] = await this.dataSource.query(sql, params);
    return {
      avgRating: Number(Number(row.avgRating).toFixed(1)),
      total: Number(row.total),
      withImage: Number(row.withImage),
      positive: Number(row.positive),
      withFollowup: Number(row.withFollowup),
    };
  }

  async getReviews(params: {
    page: number;
    limit: number;
    productId?: number;
    hasImage?: boolean;
    minRating?: number;
    hasFollowup?: boolean;
  }) {
    const { page, limit, productId, hasImage, minRating, hasFollowup } = params;

    const qb = this.reviewRepo
      .createQueryBuilder('r')
      .orderBy('r.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (productId) qb.andWhere('r.product_id = :productId', { productId });
    if (hasImage) qb.andWhere("r.images IS NOT NULL AND r.images != '[]'");
    if (minRating) qb.andWhere('r.rating >= :minRating', { minRating });
    if (hasFollowup) qb.andWhere('r.has_followup = 1');

    const [reviews, total] = await qb.getManyAndCount();

    if (reviews.length === 0) return { data: [], total };

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
        hasFollowup: r.hasFollowup,
        followupContent: r.followupContent,
        followupAt: r.followupAt,
        createdAt: r.createdAt,
      };
    });

    return { data, total };
  }
}
