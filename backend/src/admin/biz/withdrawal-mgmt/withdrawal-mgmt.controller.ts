import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { WithdrawalMgmtService } from './withdrawal-mgmt.service';

@Controller('admin/withdrawals')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class WithdrawalMgmtController {
  constructor(private readonly withdrawalMgmtService: WithdrawalMgmtService) {}

  @Get()
  @RequirePermissions('withdrawal:list')
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
  ) {
    return this.withdrawalMgmtService.list({
      page: +page,
      pageSize: +pageSize,
      status,
      userId: userId ? +userId : undefined,
    });
  }

  @Post(':id/approve')
  @RequirePermissions('withdrawal:approve')
  async approve(@Param('id') id: number) {
    return this.withdrawalMgmtService.approve(+id);
  }

  @Post(':id/reject')
  @RequirePermissions('withdrawal:reject')
  async reject(
    @Param('id') id: number,
    @Body('rejectReason') rejectReason: string,
  ) {
    return this.withdrawalMgmtService.reject(+id, rejectReason);
  }
}
