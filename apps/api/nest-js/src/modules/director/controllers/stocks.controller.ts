import { Controller, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, HttpCode } from '@nestjs/common';

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
    private readonly createStock: DirectorCreateStock,
    private readonly deleteStock: DirectorDeleteStock,
    private readonly toggleStockListing: DirectorToggleStockListing,
    private readonly updateStock: DirectorUpdateStock,
  ) {}

  /**
   * POST /director/stocks
   * Créer une action
   */
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateStockDto) {
    return await this.createStock.execute(dto.symbol, dto.name, dto.companyId);
  }

  /**
   * PATCH /director/stocks/:id
   * Modifier une action
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return await this.updateStock.execute(id, dto.name, dto.symbol, dto.isListed, dto.companyId);
  }

  /**
   * DELETE /director/stocks/:id
   * Supprimer une action
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.deleteStock.execute(id);
  }

  /**
   * POST /director/stocks/:id/toggle-listing
   * Activer/désactiver le listing d'une action
   */
  @Post(':id/toggle-listing')
  @HttpCode(200)
  async toggleListing(@Param('id') id: string) {
    return await this.toggleStockListing.execute(id);
  }
}
