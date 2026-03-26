import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  linkType?: string;

  @IsOptional()
  @IsString()
  linkValue?: string;

  @IsOptional()
  @IsNumber()
  sort?: number;
}
