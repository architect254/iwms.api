import { IsString, IsCurrency, IsOptional, IsEnum } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  for: string;

  @IsCurrency({ allow_decimal: false, allow_negatives: false })
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  from_account: string;

  @IsString()
  @IsOptional()
  to_account: string;
}
