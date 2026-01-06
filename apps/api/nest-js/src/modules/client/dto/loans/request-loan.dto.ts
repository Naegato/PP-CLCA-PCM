import { IsNumber, Min } from 'class-validator';

/**
 * RequestLoanDto
 *
 * DTO pour la demande de prêt
 */
export class RequestLoanDto {
  @IsNumber()
  @Min(1, { message: 'Loan amount must be at least 1' })
  amount: number;
}
