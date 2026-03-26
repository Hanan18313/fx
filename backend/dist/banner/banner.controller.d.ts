import { BannerService } from './banner.service';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    list(): Promise<{
        data: import("../database/entities/banner.entity").BannerEntity[];
    }>;
}
