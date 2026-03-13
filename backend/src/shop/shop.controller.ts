import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller('products')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  getProducts(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('keyword') keyword = '',
  ) {
    return this.shopService.getProducts(+page, +limit, keyword);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.shopService.getProduct(id);
  }
}
