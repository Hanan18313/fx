import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(req.user.id, dto);
  }

  @Get('stats')
  getStats(@Query('productId') productId?: string) {
    return this.reviewService.getStats(productId ? Number(productId) : undefined);
  }

  @Get()
  getReviews(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('productId') productId?: string,
    @Query('hasImage') hasImage?: string,
    @Query('minRating') minRating?: string,
    @Query('hasFollowup') hasFollowup?: string,
  ) {
    return this.reviewService.getReviews({
      page: Number(page),
      limit: Number(limit),
      productId: productId ? Number(productId) : undefined,
      hasImage: hasImage === 'true',
      minRating: minRating ? Number(minRating) : undefined,
      hasFollowup: hasFollowup === 'true',
    });
  }
}
