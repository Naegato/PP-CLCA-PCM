import { Controller, Post, Body, HttpCode, UseInterceptors, Inject } from '@nestjs/common';

// Use cases
import { DirectorLogin } from '@pp-clca-pcm/application';
import { DirectorRegistration } from '@pp-clca-pcm/application';

// DTOs
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';

// Interceptors
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { UserRepository, PasswordService, TokenService } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

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
    @Inject(REPOSITORY_TOKENS.USER)
    private readonly userRepository: UserRepository,
    @Inject('PasswordService')
    private readonly passwordService: PasswordService,
    @Inject('TokenService')
    private readonly tokenService: TokenService,
  ) {}

  /**
   * POST /director/auth/login
   * Login avec email et password
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const useCase = new DirectorLogin(this.userRepository, this.passwordService, this.tokenService);
    return await useCase.execute({
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
    const useCase = new DirectorRegistration(this.userRepository);
    return await useCase.execute(
      dto.firstname,
      dto.lastname,
      dto.email,
      dto.password,
    );
  }
}
