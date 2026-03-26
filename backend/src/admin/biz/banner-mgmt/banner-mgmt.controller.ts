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
import { BannerMgmtService } from './banner-mgmt.service';
import { CreateBannerDto } from './dto/create-banner.dto';

@Controller('admin/banners')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class BannerMgmtController {
  constructor(private readonly bannerMgmtService: BannerMgmtService) {}

  @Get()
  @RequirePermissions('banner:list')
  async list() {
    return this.bannerMgmtService.list();
  }

  @Post()
  @RequirePermissions('banner:create')
  async create(@Body() dto: CreateBannerDto) {
    return this.bannerMgmtService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('banner:update')
  async update(@Param('id') id: number, @Body() dto: CreateBannerDto) {
    return this.bannerMgmtService.update(+id, dto);
  }

  @Delete(':id')
  @RequirePermissions('banner:delete')
  async remove(@Param('id') id: number) {
    return this.bannerMgmtService.remove(+id);
  }
}
