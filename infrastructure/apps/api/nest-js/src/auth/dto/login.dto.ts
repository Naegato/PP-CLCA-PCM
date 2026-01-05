import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { LoginRequest } from '@pp-clca-pcm/application';

export class LoginDto extends LoginRequest {
  @ApiProperty({
    example: 'test@test.test',
    description: "L'email de l'utilisateur",
  })
  @IsEmail()
  @IsNotEmpty()
  declare public readonly email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description: "Le mot de passe de l'utilisateur",
  })
  @IsString()
  @IsNotEmpty()
  declare public readonly password: string;
}