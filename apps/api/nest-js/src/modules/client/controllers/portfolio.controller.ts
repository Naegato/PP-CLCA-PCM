import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, HttpCode } from '@nestjs/common';

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
    private readonly createPortfolio: ClientCreatePortfolio,
    private readonly getPortfolio: ClientGetPortfolio,
  ) {}

  /**
   * POST /client/portfolio
   * Créer un nouveau portfolio pour un compte
   */
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePortfolioDto) {
    return await this.createPortfolio.execute(dto.accountId);
  }

  /**
   * GET /client/portfolio/:accountId
   * Récupérer le portfolio d'un compte
   */
  @Get(':accountId')
  async get(@Param('accountId') accountId: string) {
    return await this.getPortfolio.execute(accountId);
  }
}
