import { Controller, Get } from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';

@Controller()
export class FlashSaleController {
  constructor(private readonly flashSaleService: FlashSaleService) {}

  @Get('products/flash-sale')
  getActive() {
    return this.flashSaleService.getActive();
  }
}
