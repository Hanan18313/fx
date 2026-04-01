import { FlashSaleService } from './flash-sale.service';
export declare class FlashSaleController {
    private readonly flashSaleService;
    constructor(flashSaleService: FlashSaleService);
    getActive(): Promise<{
        data: {
            id: any;
            name: any;
            price: number;
            originalPrice: number;
            flashPrice: number;
            images: any;
            tag: any;
            sales: any;
            profitRate: number;
            flashSaleId: any;
            stockLimit: any;
            endAt: any;
        }[];
    }>;
}
