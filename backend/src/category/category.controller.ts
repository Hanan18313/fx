import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getTree() {
    return this.categoryService.getTree();
  }

  @Get('quick')
  getQuick() {
    return this.categoryService.getQuick();
  }
}
