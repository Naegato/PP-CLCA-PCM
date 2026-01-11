import { Controller, Post, Body, HttpCode, UseGuards, UseInterceptors, Inject } from '@nestjs/common';

// Use cases
import { ClientLogin } from '@pp-clca-pcm/application';
import { ClientRegistration } from '@pp-clca-pcm/application';
import { ClientLogout } from '@pp-clca-pcm/application';
import { ClientRequestPasswordReset } from '@pp-clca-pcm/application';
import { ClientResetPassword } from '@pp-clca-pcm/application';

// DTOs
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { RequestPasswordResetDto } from '../dto/auth/request-password-reset.dto';
import { ResetPasswordDto } from '../dto/auth/reset-password.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Domain entities
import { User } from '@pp-clca-pcm/domain';

// Repositories & Services
import type {
  UserRepository,
  AccountRepository,
  AccountTypeRepository,
  PasswordService,
  TokenService,
  LogoutService,
  Security,
} from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

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
    @Inject(REPOSITORY_TOKENS.USER)
    private readonly userRepository: UserRepository,
    @Inject(REPOSITORY_TOKENS.ACCOUNT)
    private readonly accountRepository: AccountRepository,
    @Inject(REPOSITORY_TOKENS.ACCOUNT_TYPE)
    private readonly accountTypeRepository: AccountTypeRepository,
    @Inject('PasswordService')
    private readonly passwordService: PasswordService,
    @Inject('TokenService')
    private readonly tokenService: TokenService,
    @Inject('LogoutService')
    private readonly logoutService: LogoutService,
    @Inject('Security')
    private readonly security: Security,
  ) {}

  /**
   * POST /client/auth/login
   * Login avec email et password
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const useCase = new ClientLogin(this.userRepository, this.passwordService, this.tokenService);
    return await useCase.execute({
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
    const useCase = new ClientRegistration(this.userRepository, this.accountRepository, this.accountTypeRepository, this.passwordService);
    return await useCase.execute(
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
    const useCase = new ClientLogout(this.logoutService, this.security);
    return await useCase.execute();
  }

  /**
   * POST /client/auth/password-reset/request
   * Demander la réinitialisation du mot de passe
   */
  @Post('password-reset/request')
  @HttpCode(200)
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    const useCase = new ClientRequestPasswordReset(this.userRepository, this.tokenService);
    return await useCase.execute({
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
    const useCase = new ClientResetPassword(this.userRepository, this.tokenService, this.passwordService);
    return await useCase.execute({
      token: dto.token,
      newPassword: dto.newPassword,
    });
  }
}
