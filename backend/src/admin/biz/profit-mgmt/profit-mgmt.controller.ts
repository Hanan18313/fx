import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { ProfitMgmtService } from './profit-mgmt.service';

@Controller('admin/profit')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class ProfitMgmtController {
  constructor(private readonly profitMgmtService: ProfitMgmtService) {}

  @Get('stats')
  @RequirePermissions('profit:stats')
  async stats() {
    return this.profitMgmtService.getStats();
  }
}
