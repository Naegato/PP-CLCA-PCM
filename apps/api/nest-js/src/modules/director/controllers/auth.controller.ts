import { Controller, Post, Body, HttpCode, UseInterceptors } from '@nestjs/common';
import { DirectorLogin } from '@pp-clca-pcm/application';
import { DirectorRegistration } from '@pp-clca-pcm/application';

import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';

import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

/**
 * DirectorAuthController
 *
 * Gère l'authentification des directors:
 * - Login
 * - Registration
 */
@Controller('director/auth')
@UseInterceptors(ErrorInterceptor)
export class DirectorAuthController {
  constructor(
    private readonly directorLogin: DirectorLogin,
    private readonly directorRegistration: DirectorRegistration,
  ) {}

  /**
   * POST /director/auth/login
   * Login avec email et password
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return await this.directorLogin.execute({
      email: dto.email,
      password: dto.password,
    });
  }

  /**
   * POST /director/auth/register
   * Créer un nouveau compte director
   */
  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    return await this.directorRegistration.execute(
      dto.firstname,
      dto.lastname,
      dto.email,
      dto.password,
    );
  }
}
