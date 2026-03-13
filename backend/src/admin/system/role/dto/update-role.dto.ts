import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  dataScope?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sort?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status?: number;
}
