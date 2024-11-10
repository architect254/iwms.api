import {
  IsNotEmpty,
  IsString,
  IsCurrency,
  IsOptional,
  IsDate,
  IsEnum,
  IsNotEmptyObject,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { ContributionType } from './contribution.entity';
import { Type } from 'class-transformer';

export class TransactionDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  for: string;

  @IsCurrency({ allow_decimal: false, allow_negatives: false })
  amount: number;
}
export class ContributionDto {
  @IsString() type: string;

  @IsString()
  memberId: string;

  @IsInt()
  amount: number;

  @IsOptional()
  @IsString()
  accountId: string;
}

export class MonthlyContributionDto extends ContributionDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  for_month: Date;
}

export class MembershipContributionDto extends ContributionDto {}

export class BereavedMemberContributionDto extends ContributionDto {
  @IsString()
  bereavedMemberId: string;
}

export class DeceasedMemberContributionDto extends ContributionDto {
  @IsString()
  deceasedMemberId: string;
}

export class MembershipReactivationContributionDto extends ContributionDto {}

export class SearchQueryDto {
  type: string;
}
