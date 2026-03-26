import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../../../database/entities/review.entity';

@Injectable()
export class ReviewMgmtService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
  ) {}

  async list(params: {
    page: number;
    pageSize: number;
    productId?: number;
    rating?: number;
  }) {
    const { page, pageSize, productId, rating } = params;

    const qb = this.reviewRepo
      .createQueryBuilder('r')
      .leftJoin('users', 'u', 'u.id = r.user_id')
      .leftJoin('products', 'p', 'p.id = r.product_id')
      .addSelect([
        'u.nickname AS userNickname',
        "CONCAT(LEFT(u.phone, 3), '****', RIGHT(u.phone, 4)) AS userPhone",
        'p.name AS productName',
      ]);

    if (productId) {
      qb.andWhere('r.product_id = :productId', { productId });
    }
    if (rating) {
      qb.andWhere('r.rating = :rating', { rating });
    }

    qb.orderBy('r.created_at', 'DESC');

    const total = await qb.getCount();

    const raw = await qb
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getRawAndEntities();

    const list = raw.entities.map((review, idx) => ({
      ...review,
      userNickname: raw.raw[idx]?.userNickname ?? null,
      userPhone: raw.raw[idx]?.userPhone ?? null,
      productName: raw.raw[idx]?.productName ?? null,
    }));

    return { list, total, page, pageSize };
  }

  async remove(id: number) {
    await this.reviewRepo.delete(id);
    return { message: '删除成功' };
  }
}
