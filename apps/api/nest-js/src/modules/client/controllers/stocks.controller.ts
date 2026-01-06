import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';

// Use cases
import { ClientGetAvailableStocks } from '@pp-clca-pcm/application';
import { ClientGetStockWithPrice } from '@pp-clca-pcm/application';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

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
    private readonly getAvailableStocks: ClientGetAvailableStocks,
    private readonly getStockWithPrice: ClientGetStockWithPrice,
  ) {}

  /**
   * GET /client/stocks
   * Récupérer toutes les actions disponibles (listed)
   */
  @Get()
  async getAll() {
    return await this.getAvailableStocks.execute();
  }

  /**
   * GET /client/stocks/:id
   * Récupérer une action avec son prix de marché
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getStockWithPrice.execute(id);
  }
}
