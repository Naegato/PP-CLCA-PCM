import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * CreateCompanyDto
 *
 * DTO pour la création d'une entreprise
 */
export class CreateCompanyDto {
  @IsString()
  @MinLength(2, { message: 'Company name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  name: string;
}
