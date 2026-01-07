import { Controller, Post, Body, HttpCode, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientLogin } from '@pp-clca-pcm/application';
import { ClientRegistration } from '@pp-clca-pcm/application';
import { ClientLogout } from '@pp-clca-pcm/application';
import { ClientRequestPasswordReset } from '@pp-clca-pcm/application';
import { ClientResetPassword } from '@pp-clca-pcm/application';

import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { RequestPasswordResetDto } from '../dto/auth/request-password-reset.dto';
import { ResetPasswordDto } from '../dto/auth/reset-password.dto';

import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';
import { User } from '@pp-clca-pcm/domain';

/**
 * ClientAuthController
 *
 * Gère l'authentification des clients:
 * - Login
 * - Registration
 * - Logout
 * - Password reset flow
 */
@Controller('client/auth')
@UseInterceptors(ErrorInterceptor)
export class ClientAuthController {
  constructor(
    private readonly clientLogin: ClientLogin,
    private readonly clientRegistration: ClientRegistration,
    private readonly clientLogout: ClientLogout,
    private readonly clientRequestPasswordReset: ClientRequestPasswordReset,
    private readonly clientResetPassword: ClientResetPassword,
  ) {}

  /**
   * POST /client/auth/login
   * Login avec email et password
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return await this.clientLogin.execute({
      email: dto.email,
      password: dto.password,
    });
  }

  /**
   * POST /client/auth/register
   * Créer un nouveau compte client
   */
  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    return await this.clientRegistration.execute(
      dto.firstname,
      dto.lastname,
      dto.email,
      dto.password,
    );
  }

  /**
   * POST /client/auth/logout
   * Déconnexion (nécessite authentification)
   */
  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('client')
  async logout(@CurrentUser() user: User) {
    return await this.clientLogout.execute();
  }

  /**
   * POST /client/auth/password-reset/request
   * Demander la réinitialisation du mot de passe
   */
  @Post('password-reset/request')
  @HttpCode(200)
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return await this.clientRequestPasswordReset.execute({
      email: dto.email,
    });
  }

  /**
   * POST /client/auth/password-reset/confirm
   * Confirmer la réinitialisation avec le token
   */
  @Post('password-reset/confirm')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.clientResetPassword.execute({
      token: dto.token,
      newPassword: dto.newPassword,
    });
  }
}
