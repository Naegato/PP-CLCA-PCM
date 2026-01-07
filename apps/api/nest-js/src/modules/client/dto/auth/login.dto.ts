import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * LoginDto
 *
 * DTO pour la requête de login client
 */
export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
