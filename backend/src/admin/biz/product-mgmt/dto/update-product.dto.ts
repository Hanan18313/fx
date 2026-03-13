import { IsString, IsOptional, IsNumber, IsArray, IsEnum, Min, Max } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: '价格必须大于0' })
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: '利润率不能小于0' })
  @Max(1, { message: '利润率不能大于1' })
  profitRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: '库存不能小于0' })
  stock?: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(['on', 'off'])
  status?: string;
}
