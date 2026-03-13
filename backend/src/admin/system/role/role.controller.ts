import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignMenusDto } from './dto/assign-menus.dto';

@Controller('admin/system/roles')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @RequirePermissions('system:role:list')
  async list() {
    return this.roleService.list();
  }

  @Post()
  @RequirePermissions('system:role:create')
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('system:role:update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, dto);
  }

  @Put(':id/menus')
  @RequirePermissions('system:role:update')
  async assignMenus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignMenusDto,
  ) {
    return this.roleService.assignMenus(id, dto.menuIds);
  }
}
