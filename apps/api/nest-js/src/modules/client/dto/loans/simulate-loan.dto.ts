import { IsNumber, Min, Max } from 'class-validator';

/**
 * SimulateLoanDto
 *
 * DTO pour la simulation de prêt
 */
export class SimulateLoanDto {
  @IsNumber()
  @Min(1, { message: 'Principal must be at least 1' })
  principal: number;

  @IsNumber()
  @Min(0, { message: 'Interest rate must be at least 0' })
  @Max(100, { message: 'Interest rate must not exceed 100' })
  interestRate: number;

  @IsNumber()
  @Min(1, { message: 'Duration must be at least 1 month' })
  @Max(360, { message: 'Duration must not exceed 360 months (30 years)' })
  durationMonths: number;
}
