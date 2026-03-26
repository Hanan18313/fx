import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { CategoryMgmtService } from './category-mgmt.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('admin/categories')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class CategoryMgmtController {
  constructor(private readonly categoryMgmtService: CategoryMgmtService) {}

  @Get()
  @RequirePermissions('category:list')
  async list() {
    return this.categoryMgmtService.list();
  }

  @Post()
  @RequirePermissions('category:create')
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryMgmtService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('category:update')
  async update(@Param('id') id: number, @Body() dto: CreateCategoryDto) {
    return this.categoryMgmtService.update(+id, dto);
  }

  @Delete(':id')
  @RequirePermissions('category:delete')
  async remove(@Param('id') id: number) {
    return this.categoryMgmtService.remove(+id);
  }
}
