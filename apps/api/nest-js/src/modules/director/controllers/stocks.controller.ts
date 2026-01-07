import { Controller, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, HttpCode, Inject } from '@nestjs/common';

// Use cases
import { DirectorCreateStock } from '@pp-clca-pcm/application';
import { DirectorDeleteStock } from '@pp-clca-pcm/application';
import { DirectorToggleStockListing } from '@pp-clca-pcm/application';
import { DirectorUpdateStock } from '@pp-clca-pcm/application';

// DTOs
import { CreateStockDto } from '../dto/stocks/create-stock.dto';
import { UpdateStockDto } from '../dto/stocks/update-stock.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { StockRepository, CompanyRepository, PortfolioRepository, StockOrderRepository } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

/**
 * DirectorStocksController
 *
 * Gère la gestion des actions par les directors:
 * - Créer une action
 * - Modifier une action
 * - Supprimer une action
 * - Activer/désactiver le listing d'une action
 */
@Controller('director/stocks')
@UseGuards(AuthGuard, RolesGuard)
@Roles('director')
@UseInterceptors(ErrorInterceptor)
export class DirectorStocksController {
  constructor(
    @Inject(REPOSITORY_TOKENS.STOCK)
    private readonly stockRepository: StockRepository,
    @Inject(REPOSITORY_TOKENS.COMPANY)
    private readonly companyRepository: CompanyRepository,
    @Inject(REPOSITORY_TOKENS.PORTFOLIO)
    private readonly portfolioRepository: PortfolioRepository,
    @Inject(REPOSITORY_TOKENS.STOCK_ORDER)
    private readonly stockOrderRepository: StockOrderRepository,
  ) {}

  /**
   * POST /director/stocks
   * Créer une action
   */
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateStockDto) {
    const useCase = new DirectorCreateStock(this.stockRepository, this.companyRepository);
    return await useCase.execute(dto.symbol, dto.name, dto.companyId);
  }

  /**
   * PATCH /director/stocks/:id
   * Modifier une action
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    const useCase = new DirectorUpdateStock(this.stockRepository, this.companyRepository);
    return await useCase.execute(id, dto.name, dto.symbol, dto.isListed, dto.companyId);
  }

  /**
   * DELETE /director/stocks/:id
   * Supprimer une action
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const useCase = new DirectorDeleteStock(this.stockRepository, this.portfolioRepository, this.stockOrderRepository);
    return await useCase.execute(id);
  }

  /**
   * POST /director/stocks/:id/toggle-listing
   * Activer/désactiver le listing d'une action
   */
  @Post(':id/toggle-listing')
  @HttpCode(200)
  async toggleListing(@Param('id') id: string) {
    const useCase = new DirectorToggleStockListing(this.stockRepository);
    return await useCase.execute(id);
  }
}
