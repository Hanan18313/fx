import { Repository } from 'typeorm';
import { FlashSaleEntity } from '../database/entities/flash-sale.entity';
export declare class FlashSaleService {
    private readonly flashSaleRepo;
    constructor(flashSaleRepo: Repository<FlashSaleEntity>);
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
