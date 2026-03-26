import { Repository } from 'typeorm';
import { BannerEntity } from '../../../database/entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
export declare class BannerMgmtService {
    private readonly bannerRepo;
    constructor(bannerRepo: Repository<BannerEntity>);
    list(): Promise<BannerEntity[]>;
    create(dto: CreateBannerDto): Promise<BannerEntity>;
    update(id: number, dto: Partial<CreateBannerDto>): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
