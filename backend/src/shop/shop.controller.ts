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
    @Query('categoryId') categoryId?: string,
  ) {
    return this.shopService.getProducts(+page, +limit, keyword, categoryId ? +categoryId : undefined);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.shopService.getProduct(id);
  }
}
