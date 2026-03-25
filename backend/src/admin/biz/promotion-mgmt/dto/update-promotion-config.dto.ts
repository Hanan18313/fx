import { IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class UpdatePromotionConfigDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  referral_reward_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  commission_rate?: number;

  @IsOptional()
  @IsBoolean()
  referral_reward_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  commission_enabled?: boolean;
}
