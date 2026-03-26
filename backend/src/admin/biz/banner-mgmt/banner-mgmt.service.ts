import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from '../../../database/entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannerMgmtService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepo: Repository<BannerEntity>,
  ) {}

  async list() {
    return this.bannerRepo.find({ order: { sort: 'ASC', id: 'ASC' } });
  }

  async create(dto: CreateBannerDto) {
    const entity = this.bannerRepo.create(dto);
    return this.bannerRepo.save(entity);
  }

  async update(id: number, dto: Partial<CreateBannerDto>) {
    const banner = await this.bannerRepo.findOneBy({ id });
    if (!banner) throw new BadRequestException('Banner不存在');
    await this.bannerRepo.update(id, dto);
    return { message: '更新成功' };
  }

  async remove(id: number) {
    await this.bannerRepo.delete(id);
    return { message: '删除成功' };
  }
}
