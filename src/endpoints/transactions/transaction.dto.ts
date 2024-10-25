import { IsNotEmpty, IsString, IsCurrency, IsOptional } from 'class-validator';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  for: string;

  @IsCurrency({ allow_decimal: false, allow_negatives: false })
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  from_account: string;

  @IsString()
  @IsNotEmpty()
  to_account: string;
}

export class SearchQueryDto {
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
