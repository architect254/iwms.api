import { IsCurrency } from 'class-validator';

export class UpdateContributionAmountDto {
  @IsCurrency()
  amount: number;
}
