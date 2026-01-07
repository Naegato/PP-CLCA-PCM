import { Controller, Get, Param, UseGuards, UseInterceptors, Inject } from '@nestjs/common';

// Use cases
import { ClientGetAvailableStocks } from '@pp-clca-pcm/application';
import { ClientGetStockWithPrice } from '@pp-clca-pcm/application';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { StockRepository, MarketService } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

/**
 * ClientStocksController
 *
 * Gère la consultation des actions disponibles:
 * - Liste des actions disponibles (listed)
 * - Récupérer une action avec son prix de marché
 */
@Controller('client/stocks')
@UseGuards(AuthGuard, RolesGuard)
@Roles('client')
@UseInterceptors(ErrorInterceptor)
export class ClientStocksController {
  constructor(
    @Inject(REPOSITORY_TOKENS.STOCK)
    private readonly stockRepository: StockRepository,
    @Inject('MarketService')
    private readonly marketService: MarketService,
  ) {}

  /**
   * GET /client/stocks
   * Récupérer toutes les actions disponibles (listed)
   */
  @Get()
  async getAll() {
    const useCase = new ClientGetAvailableStocks(this.stockRepository);
    return await useCase.execute();
  }

  /**
   * GET /client/stocks/:id
   * Récupérer une action avec son prix de marché
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    const useCase = new ClientGetStockWithPrice(this.stockRepository, this.marketService);
    return await useCase.execute(id);
  }
}
