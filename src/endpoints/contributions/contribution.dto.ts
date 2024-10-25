import {
  IsNotEmpty,
  IsString,
  IsCurrency,
  IsOptional,
  IsDate,
  IsEnum,
  IsNotEmptyObject,
  ValidateNested,
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
  @IsEnum(() => ContributionType)
  type: ContributionType;

  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsNotEmptyObject({}, { message: 'transaction should not be empty' })
  @ValidateNested()
  transactionDto: TransactionDto;
}

export class MonthlyContributionDto extends ContributionDto {
  @IsDate()
  @Type(() => Date)
  for_month: Date;
}

export class MembershipContributionDto extends ContributionDto {}

export class BereavedMemberContributionDto extends ContributionDto {}

export class DeceasedMemberContributionDto extends ContributionDto {}

export class MembershipReactivationContributionDto extends ContributionDto {}

export class SearchQueryDto {

}
