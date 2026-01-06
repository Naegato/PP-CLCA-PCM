import { IsString, MinLength } from 'class-validator';

/**
 * ResetPasswordDto
 *
 * DTO pour confirmer la réinitialisation du mot de passe avec le token
 */
export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;
}
