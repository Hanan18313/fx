import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../../common/guards/admin-jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { ReviewMgmtService } from './review-mgmt.service';

@Controller('admin/reviews')
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
export class ReviewMgmtController {
  constructor(private readonly reviewMgmtService: ReviewMgmtService) {}

  @Get()
  @RequirePermissions('review:list')
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('productId') productId?: string,
    @Query('rating') rating?: string,
  ) {
    return this.reviewMgmtService.list({
      page: +page,
      pageSize: +pageSize,
      productId: productId ? +productId : undefined,
      rating: rating ? +rating : undefined,
    });
  }

  @Delete(':id')
  @RequirePermissions('review:delete')
  async remove(@Param('id') id: number) {
    return this.reviewMgmtService.remove(+id);
  }
}
