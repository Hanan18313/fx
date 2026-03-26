import { Repository } from 'typeorm';
import { BannerEntity } from '../database/entities/banner.entity';
export declare class BannerService {
    private readonly bannerRepo;
    constructor(bannerRepo: Repository<BannerEntity>);
    list(): Promise<{
        data: BannerEntity[];
    }>;
}
