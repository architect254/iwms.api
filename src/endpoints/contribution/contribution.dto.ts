import {
  IsNotEmpty,
  IsString,
  IsCurrency,
  IsOptional,
  IsDate,
} from 'class-validator';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  for: string;

  @IsCurrency({ allow_decimal: false, allow_negatives: false })
  @IsNotEmpty()
  amount: number;
}
export class ContributionDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  from_member_id: string;

  @IsString()
  @IsNotEmpty()
  for_member_id: string;
}

export class MembershipContributionDto extends ContributionDto {}

export class MonthlyContributionDto extends ContributionDto {
  @IsNotEmpty()
  @IsDate()
  for_month: Date;
}
export class BereavedMemberContributionDto extends ContributionDto {}

export class DeceasedMemberContributionDto extends ContributionDto {}

export class MembershipReactivationContributionDto extends ContributionDto {}

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
