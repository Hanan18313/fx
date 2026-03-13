import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { ProductMgmtService } from './product-mgmt.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('admin/products')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class ProductMgmtController {
  constructor(private readonly productMgmtService: ProductMgmtService) {}

  @Get()
  @RequirePermissions('product:list')
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    return this.productMgmtService.list({
      page: +page,
      pageSize: +pageSize,
      name,
      category,
      status,
    });
  }

  @Post()
  @RequirePermissions('product:create')
  async create(@Body() dto: CreateProductDto) {
    return this.productMgmtService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('product:update')
  async update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productMgmtService.update(+id, dto);
  }

  @Patch(':id/status')
  @RequirePermissions('product:update')
  async toggleStatus(@Param('id') id: number) {
    return this.productMgmtService.toggleStatus(+id);
  }
}
