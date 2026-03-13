import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { UserMgmtService } from './user-mgmt.service';

@Controller('admin/users')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class UserMgmtController {
  constructor(private readonly userMgmtService: UserMgmtService) {}

  @Get()
  @RequirePermissions('user:list')
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('phone') phone?: string,
    @Query('nickname') nickname?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.userMgmtService.list({
      page: +page,
      pageSize: +pageSize,
      phone,
      nickname,
      role,
      status: status !== undefined ? +status : undefined,
    });
  }

  @Patch(':id')
  @RequirePermissions('user:update')
  async update(
    @Param('id') id: number,
    @Body() body: { status?: number; role?: string },
  ) {
    return this.userMgmtService.update(+id, body);
  }
}
