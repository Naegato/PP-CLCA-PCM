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
  Inject,
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

// Repositories & Services
import type {
  StockOrderRepository,
  StockRepository,
  AccountRepository,
  PortfolioRepository,
  Security
} from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

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
    @Inject(REPOSITORY_TOKENS.STOCK_ORDER)
    private readonly stockOrderRepository: StockOrderRepository,
    @Inject(REPOSITORY_TOKENS.STOCK)
    private readonly stockRepository: StockRepository,
    @Inject(REPOSITORY_TOKENS.ACCOUNT)
    private readonly accountRepository: AccountRepository,
    @Inject(REPOSITORY_TOKENS.PORTFOLIO)
    private readonly portfolioRepository: PortfolioRepository,
    @Inject('Security')
    private readonly security: Security,
  ) {}

  /**
   * GET /client/stock-orders
   * Récupérer tous les ordres du client connecté
   */
  @Get()
  async getAll(@CurrentUser() user: User) {
    const useCase = new ClientGetStockOrders(this.stockOrderRepository);
    return await useCase.execute(user);
  }

  /**
   * POST /client/stock-orders
   * Créer un nouvel ordre d'achat ou de vente
   */
  @Post()
  @HttpCode(201)
  async register(@Body() dto: RegisterStockOrderDto) {
    // Récupérer le compte
    const getAccountUseCase = new ClientGetAccount(this.accountRepository);
    const account = await getAccountUseCase.execute(dto.accountId);
    if (account instanceof Error) {
      return account;
    }

    // Convertir le side string en OrderSide enum
    const side = dto.side === 'BUY' ? OrderSide.BUY : OrderSide.SELL;

    // Créer le usecase de match pour le passer au register
    const matchUseCase = new ClientMatchStockOrder(
      this.stockOrderRepository,
      this.accountRepository,
      this.portfolioRepository,
    );

    // Enregistrer l'ordre (et matcher automatiquement)
    const registerUseCase = new ClientRegisterStockOrder(
      this.stockOrderRepository,
      this.stockRepository,
      matchUseCase,
    );
    return await registerUseCase.execute(
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
    const getOrdersUseCase = new ClientGetStockOrders(this.stockOrderRepository);
    const orders = await getOrdersUseCase.execute(user);
    if (orders instanceof Error) {
      return orders;
    }

    const order = orders.find((o) => o.identifier === id);
    if (!order) {
      return new Error('Stock order not found');
    }

    // Matcher l'ordre
    const matchUseCase = new ClientMatchStockOrder(
      this.stockOrderRepository,
      this.accountRepository,
      this.portfolioRepository,
    );
    return await matchUseCase.execute(order);
  }

  /**
   * DELETE /client/stock-orders/:id
   * Annuler un ordre (uniquement s'il n'est pas exécuté)
   */
  @Delete(':id')
  @HttpCode(204)
  async cancel(@Param('id') id: string, @CurrentUser() user: User) {
    const useCase = new ClientCancelStockOrder(this.stockOrderRepository, this.security);
    return await useCase.execute(id);
  }
}
