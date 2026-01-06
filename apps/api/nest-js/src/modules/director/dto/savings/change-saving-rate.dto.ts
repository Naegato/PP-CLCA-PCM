import { IsString, IsNumber, Min, Max } from 'class-validator';

/**
 * ChangeSavingRateDto
 *
 * DTO pour modifier le taux d'épargne d'un type de compte
 */
export class ChangeSavingRateDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0, { message: 'Rate must be at least 0' })
  @Max(100, { message: 'Rate must not exceed 100' })
  rate: number;
}
