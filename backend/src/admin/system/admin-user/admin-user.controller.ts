import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { AdminJwtAuthGuard } from "../../../common/guards/admin-jwt-auth.guard";
import { PermissionsGuard } from "../../../common/guards/permissions.guard";
import { RequirePermissions } from "../../../common/decorators/require-permissions.decorator";
import { CurrentAdmin } from "../../../common/decorators/current-admin.decorator";
import { AdminUserService } from "./admin-user.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Controller("admin/system/admins")
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  @RequirePermissions("system:admin:list")
  async list(
    @Query("page") page?: number,
    @Query("pageSize") pageSize?: number,
    @Query("username") username?: string,
    @Query("realName") realName?: string,
    @Query("phone") phone?: string,
    @Query("status") status?: number,
    @Query("deptId") deptId?: number,
  ) {
    return this.adminUserService.list({
      page: page ? +page : undefined,
      pageSize: pageSize ? +pageSize : undefined,
      username,
      realName,
      phone,
      status: status != null && !isNaN(+status) ? +status : undefined,
      deptId: deptId ? +deptId : undefined,
    });
  }

  @Post()
  @RequirePermissions("system:admin:create")
  async create(
    @Body() dto: CreateAdminDto,
    @CurrentAdmin("id") adminId: number,
  ) {
    return this.adminUserService.create(dto, adminId);
  }

  @Put(":id")
  @RequirePermissions("system:admin:update")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAdminDto,
  ) {
    return this.adminUserService.update(id, dto);
  }

  @Patch(":id/reset-password")
  @RequirePermissions("system:admin:reset-pwd")
  async resetPassword(
    @Param("id", ParseIntPipe) id: number,
    @Body("password") password: string,
  ) {
    return this.adminUserService.resetPassword(id, password);
  }
}
