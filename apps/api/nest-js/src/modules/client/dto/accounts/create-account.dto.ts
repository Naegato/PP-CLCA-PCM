import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * CreateAccountDto
 *
 * DTO pour la création d'un compte
 */
export class CreateAccountDto {
  @IsString()
  @MinLength(2, { message: 'Account name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Account name must not exceed 50 characters' })
  name: string;
}
