import { Controller, Get, Put, Query, Body, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { OperationLog } from '../../../common/decorators/operation-log.decorator';
import { PromotionMgmtService } from './promotion-mgmt.service';
import { UpdatePromotionConfigDto } from './dto/update-promotion-config.dto';

@Controller('admin/promotion')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class PromotionMgmtController {
  constructor(private readonly promotionMgmtService: PromotionMgmtService) {}

  @Get('overview')
  @RequirePermissions('promotion:overview')
  getOverview() {
    return this.promotionMgmtService.getOverview();
  }

  @Get('rewards')
  @RequirePermissions('promotion:rewards')
  getRewards(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('type') type?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    return this.promotionMgmtService.getRewards(+page, +limit, type, startDate, endDate);
  }

  @Get('config')
  @RequirePermissions('promotion:config')
  getConfig() {
    return this.promotionMgmtService.getConfig();
  }

  @Put('config')
  @RequirePermissions('promotion:config:edit')
  @OperationLog('推广管理', '修改推广配置')
  updateConfig(@Body() dto: UpdatePromotionConfigDto) {
    return this.promotionMgmtService.updateConfig(dto);
  }
}
