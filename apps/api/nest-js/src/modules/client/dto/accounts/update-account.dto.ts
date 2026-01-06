import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * UpdateAccountDto
 *
 * DTO pour la modification d'un nom de compte
 */
export class UpdateAccountDto {
  @IsString()
  @MinLength(2, { message: 'Account name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Account name must not exceed 50 characters' })
  name: string;
}
