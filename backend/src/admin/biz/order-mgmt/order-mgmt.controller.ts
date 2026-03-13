import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { OrderMgmtService } from './order-mgmt.service';

@Controller('admin/orders')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class OrderMgmtController {
  constructor(private readonly orderMgmtService: OrderMgmtService) {}

  @Get()
  @RequirePermissions('order:list')
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.orderMgmtService.list({
      page: +page,
      pageSize: +pageSize,
      status,
      userId: userId ? +userId : undefined,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  @RequirePermissions('order:list')
  async detail(@Param('id') id: number) {
    return this.orderMgmtService.detail(+id);
  }

  @Patch(':id/status')
  @RequirePermissions('order:update')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ) {
    return this.orderMgmtService.updateStatus(+id, status);
  }
}
