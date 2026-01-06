import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * UpdateCompanyDto
 *
 * DTO pour la modification d'une entreprise
 */
export class UpdateCompanyDto {
  @IsString()
  @MinLength(2, { message: 'Company name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  name: string;
}
