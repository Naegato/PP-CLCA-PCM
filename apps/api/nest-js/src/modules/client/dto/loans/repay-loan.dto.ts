import { IsString, IsNumber, Min } from 'class-validator';

/**
 * RepayLoanDto
 *
 * DTO pour le remboursement d'un prêt
 */
export class RepayLoanDto {
  @IsString()
  accountId: string;

  @IsString()
  loanId: string;

  @IsNumber()
  @Min(0.01, { message: 'Repayment amount must be greater than 0' })
  amount: number;
}
