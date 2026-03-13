import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('admin/system/menus')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @RequirePermissions('system:menu:list')
  async list() {
    return this.menuService.list();
  }

  @Post()
  @RequirePermissions('system:menu:create')
  async create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('system:menu:update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('system:menu:update')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.delete(id);
  }
}
