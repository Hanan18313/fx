import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from '../database/entities/banner.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepo: Repository<BannerEntity>,
  ) {}

  async list() {
    const data = await this.bannerRepo.find({
      where: { status: 1 },
      order: { sort: 'ASC' },
    });
    return { data };
  }
}
