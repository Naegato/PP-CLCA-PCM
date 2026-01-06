import { IsEmail } from 'class-validator';

/**
 * RequestPasswordResetDto
 *
 * DTO pour demander la réinitialisation du mot de passe
 */
export class RequestPasswordResetDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}
