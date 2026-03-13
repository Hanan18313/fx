import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { LogService } from './log.service';

@Controller('admin/system/logs')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('operations')
  @RequirePermissions('system:log:list')
  async listOperationLogs(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('module') module?: string,
    @Query('action') action?: string,
    @Query('adminName') adminName?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.logService.listOperationLogs({
      page: page ? +page : undefined,
      pageSize: pageSize ? +pageSize : undefined,
      module,
      action,
      adminName,
      startDate,
      endDate,
    });
  }

  @Get('logins')
  @RequirePermissions('system:log:list')
  async listLoginLogs(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('username') username?: string,
    @Query('status') status?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.logService.listLoginLogs({
      page: page ? +page : undefined,
      pageSize: pageSize ? +pageSize : undefined,
      username,
      status: status !== undefined ? +status : undefined,
      startDate,
      endDate,
    });
  }
}
