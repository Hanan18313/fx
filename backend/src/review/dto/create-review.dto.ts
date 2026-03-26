import { IsNumber, IsOptional, IsString, IsArray, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  order_id: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsNumber()
  is_anonymous?: number;
}
