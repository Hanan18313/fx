import { Controller, Post, Get, Body, UseGuards, Req } from "@nestjs/common";
import { Request } from "express";
import { AdminAuthService } from "./admin-auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminJwtAuthGuard } from "../../common/guards/admin-jwt-auth.guard";
import { CurrentAdmin } from "../../common/decorators/current-admin.decorator";

@Controller("admin/auth")
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post("login")
  async login(@Body() dto: AdminLoginDto, @Req() req: Request) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip;
    const userAgent = req.headers["user-agent"];
    return this.adminAuthService.login(dto, ip, userAgent);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Post("logout")
  async logout(
    @CurrentAdmin("id") adminId: number,
    @CurrentAdmin("username") username: string,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip;
    const userAgent = req.headers["user-agent"];
    await this.adminAuthService.logout(token, adminId, username, ip, userAgent);
    return { message: "退出成功" };
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get("profile")
  async getProfile(@CurrentAdmin("id") adminId: number) {
    return this.adminAuthService.getProfile(adminId);
  }
}
