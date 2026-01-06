import { Controller, Post, Body, HttpCode, UseInterceptors } from '@nestjs/common';
import { AdvisorLogin } from '@pp-clca-pcm/application';
import { AdvisorRegistration } from '@pp-clca-pcm/application';

import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';

import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

/**
 * AdvisorAuthController
 *
 * Gère l'authentification des advisors:
 * - Login
 * - Registration
 */
@Controller('advisor/auth')
@UseInterceptors(ErrorInterceptor)
export class AdvisorAuthController {
  constructor(
    private readonly advisorLogin: AdvisorLogin,
    private readonly advisorRegistration: AdvisorRegistration,
  ) {}

  /**
   * POST /advisor/auth/login
   * Login avec email et password
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return await this.advisorLogin.execute({
      email: dto.email,
      password: dto.password,
    });
  }

  /**
   * POST /advisor/auth/register
   * Créer un nouveau compte advisor
   */
  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    return await this.advisorRegistration.execute(
      dto.firstname,
      dto.lastname,
      dto.email,
      dto.password,
    );
  }
}
