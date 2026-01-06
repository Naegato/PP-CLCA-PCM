import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';

// Use cases
import { ClientGetStockOrders } from '@pp-clca-pcm/application';
import { ClientRegisterStockOrder } from '@pp-clca-pcm/application';
import { ClientCancelStockOrder } from '@pp-clca-pcm/application';
import { ClientMatchStockOrder } from '@pp-clca-pcm/application';
import { ClientGetAccount } from '@pp-clca-pcm/application';

// DTOs
import { RegisterStockOrderDto } from '../dto/stock-orders/register-stock-order.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Domain entities
import { User } from '@pp-clca-pcm/domain';
import { OrderSide } from '@pp-clca-pcm/domain';

/**
 * ClientStockOrdersController
 *
 * Gère toutes les opérations sur les ordres d'actions:
 * - Liste des ordres du client
 * - Créer un ordre (achat/vente)
 * - Matcher un ordre avec les ordres existants
 * - Annuler un ordre
 */
@Controller('client/stock-orders')
@UseGuards(AuthGuard, RolesGuard)
@Roles('client')
@UseInterceptors(ErrorInterceptor)
export class ClientStockOrdersController {
  constructor(
    private readonly getStockOrders: ClientGetStockOrders,
    private readonly registerStockOrder: ClientRegisterStockOrder,
    private readonly cancelStockOrder: ClientCancelStockOrder,
    private readonly matchStockOrder: ClientMatchStockOrder,
    private readonly getAccount: ClientGetAccount,
  ) {}

  /**
   * GET /client/stock-orders
   * Récupérer tous les ordres du client connecté
   */
  @Get()
  async getAll(@CurrentUser() user: User) {
    return await this.getStockOrders.execute(user);
  }

  /**
   * POST /client/stock-orders
   * Créer un nouvel ordre d'achat ou de vente
   */
  @Post()
  @HttpCode(201)
  async register(@Body() dto: RegisterStockOrderDto) {
    // Récupérer le compte
    const account = await this.getAccount.execute(dto.accountId);
    if (account instanceof Error) {
      return account;
    }

    // Convertir le side string en OrderSide enum
    const side = dto.side === 'BUY' ? OrderSide.BUY : OrderSide.SELL;

    // Enregistrer l'ordre (et matcher automatiquement)
    return await this.registerStockOrder.execute(
      account,
      dto.stockId,
      side,
      dto.price,
      dto.quantity,
    );
  }

  /**
   * POST /client/stock-orders/:id/match
   * Matcher un ordre avec les ordres existants
   */
  @Post(':id/match')
  @HttpCode(200)
  async match(@Param('id') id: string, @CurrentUser() user: User) {
    // Récupérer tous les ordres du client et trouver le bon
    const orders = await this.getStockOrders.execute(user);
    if (orders instanceof Error) {
      return orders;
    }

    const order = orders.find((o) => o.identifier === id);
    if (!order) {
      return new Error('Stock order not found');
    }

    // Matcher l'ordre
    return await this.matchStockOrder.execute(order);
  }

  /**
   * DELETE /client/stock-orders/:id
   * Annuler un ordre (uniquement s'il n'est pas exécuté)
   */
  @Delete(':id')
  @HttpCode(204)
  async cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.cancelStockOrder.execute(id, user);
  }
}
