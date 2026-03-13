import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('admin/dashboard')
@UseGuards(AdminJwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getStats() {
    return this.dashboardService.getStats();
  }
}
