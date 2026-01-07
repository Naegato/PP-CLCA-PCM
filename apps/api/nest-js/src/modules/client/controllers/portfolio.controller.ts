import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, HttpCode, Inject } from '@nestjs/common';

// Use cases
import { ClientCreatePortfolio } from '@pp-clca-pcm/application';
import { ClientGetPortfolio } from '@pp-clca-pcm/application';

// DTOs
import { CreatePortfolioDto } from '../dto/portfolio/create-portfolio.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { PortfolioRepository, AccountRepository } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

/**
 * ClientPortfolioController
 *
 * Gère les portfolios d'actions des clients:
 * - Créer un portfolio pour un compte
 * - Récupérer le portfolio d'un compte
 */
@Controller('client/portfolio')
@UseGuards(AuthGuard, RolesGuard)
@Roles('client')
@UseInterceptors(ErrorInterceptor)
export class ClientPortfolioController {
  constructor(
    @Inject(REPOSITORY_TOKENS.PORTFOLIO)
    private readonly portfolioRepository: PortfolioRepository,
    @Inject(REPOSITORY_TOKENS.ACCOUNT)
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * POST /client/portfolio
   * Créer un nouveau portfolio pour un compte
   */
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePortfolioDto) {
    const useCase = new ClientCreatePortfolio(this.portfolioRepository, this.accountRepository);
    return await useCase.execute(dto.accountId);
  }

  /**
   * GET /client/portfolio/:accountId
   * Récupérer le portfolio d'un compte
   */
  @Get(':accountId')
  async get(@Param('accountId') accountId: string) {
    const useCase = new ClientGetPortfolio(this.portfolioRepository, this.accountRepository);
    return await useCase.execute(accountId);
  }
}
