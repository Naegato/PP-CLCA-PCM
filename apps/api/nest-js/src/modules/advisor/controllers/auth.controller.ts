import { Controller, Post, Body, HttpCode, UseInterceptors, Inject } from '@nestjs/common';

// Use cases
import { AdvisorLogin } from '@pp-clca-pcm/application';
import { AdvisorRegistration } from '@pp-clca-pcm/application';

// DTOs
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';

// Interceptors
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { UserRepository, PasswordService, TokenService } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

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
    @Inject(REPOSITORY_TOKENS.USER)
    private readonly userRepository: UserRepository,
    @Inject('PasswordService')
    private readonly passwordService: PasswordService,
    @Inject('TokenService')
    private readonly tokenService: TokenService,
  ) {}

  /**
   * POST /advisor/auth/login
   * Login avec email et password
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const useCase = new AdvisorLogin(this.userRepository, this.passwordService, this.tokenService);
    return await useCase.execute({
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
    const useCase = new AdvisorRegistration(this.userRepository, this.passwordService);
    return await useCase.execute(
      dto.firstname,
      dto.lastname,
      dto.email,
      dto.password,
    );
  }
}
