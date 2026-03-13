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
import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';

@Controller('admin/system/depts')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Get()
  @RequirePermissions('system:dept:list')
  async list() {
    return this.deptService.list();
  }

  @Post()
  @RequirePermissions('system:dept:create')
  async create(@Body() dto: CreateDeptDto) {
    return this.deptService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('system:dept:update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeptDto,
  ) {
    return this.deptService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('system:dept:update')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.deptService.delete(id);
  }
}
