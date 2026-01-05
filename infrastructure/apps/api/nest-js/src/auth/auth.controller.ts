import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    console.log('AuthController: login called with body:', body);


  }
}
