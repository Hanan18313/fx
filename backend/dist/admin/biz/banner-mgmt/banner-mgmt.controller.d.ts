import { BannerMgmtService } from './banner-mgmt.service';
import { CreateBannerDto } from './dto/create-banner.dto';
export declare class BannerMgmtController {
    private readonly bannerMgmtService;
    constructor(bannerMgmtService: BannerMgmtService);
    list(): Promise<import("../../../database/entities/banner.entity").BannerEntity[]>;
    create(dto: CreateBannerDto): Promise<import("../../../database/entities/banner.entity").BannerEntity>;
    update(id: number, dto: CreateBannerDto): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
