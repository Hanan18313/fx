import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { NotificationMgmtService } from './notification-mgmt.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('admin/notifications')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class NotificationMgmtController {
  constructor(
    private readonly notificationMgmtService: NotificationMgmtService,
  ) {}

  @Get()
  @RequirePermissions('notification:list')
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('type') type?: string,
  ) {
    return this.notificationMgmtService.list({
      page: +page,
      pageSize: +pageSize,
      type,
    });
  }

  @Post()
  @RequirePermissions('notification:create')
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationMgmtService.create(dto);
  }

  @Delete(':id')
  @RequirePermissions('notification:delete')
  async remove(@Param('id') id: number) {
    return this.notificationMgmtService.remove(+id);
  }
}
