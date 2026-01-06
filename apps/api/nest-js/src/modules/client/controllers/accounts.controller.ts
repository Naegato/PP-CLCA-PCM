import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';

// Use cases
import { ClientCreateAccount } from '@pp-clca-pcm/application';
import { ClientSavingAccountCreate } from '@pp-clca-pcm/application';
import { ClientGetAccount } from '@pp-clca-pcm/application';
import { ClientGetBalanceAccount } from '@pp-clca-pcm/application';
import { ClientUpdateNameAccount } from '@pp-clca-pcm/application';
import { ClientDeleteAccount } from '@pp-clca-pcm/application';

// DTOs
import { CreateAccountDto } from '../dto/accounts/create-account.dto';
import { UpdateAccountDto } from '../dto/accounts/update-account.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Domain entities
import { User } from '@pp-clca-pcm/domain';

/**
 * ClientAccountsController
 *
 * Gère toutes les opérations sur les comptes client:
 * - Créer un compte (normal ou épargne)
 * - Récupérer un compte
 * - Récupérer le solde d'un compte
 * - Modifier le nom d'un compte
 * - Supprimer un compte
 */
@Controller('client/accounts')
@UseGuards(AuthGuard, RolesGuard)
@Roles('client')
@UseInterceptors(ErrorInterceptor)
export class ClientAccountsController {
  constructor(
    private readonly createAccount: ClientCreateAccount,
    private readonly createSavingsAccount: ClientSavingAccountCreate,
    private readonly getAccount: ClientGetAccount,
    private readonly getBalance: ClientGetBalanceAccount,
    private readonly updateAccountName: ClientUpdateNameAccount,
    private readonly deleteAccount: ClientDeleteAccount,
  ) {}

  /**
   * POST /client/accounts
   * Créer un nouveau compte normal
   */
  @Post()
  @HttpCode(201)
  async create(@CurrentUser() user: User, @Body() dto: CreateAccountDto) {
    return await this.createAccount.execute(user, dto.name);
  }

  /**
   * POST /client/accounts/savings
   * Créer un nouveau compte épargne
   */
  @Post('savings')
  @HttpCode(201)
  async createSavings(@CurrentUser() user: User, @Body() dto: CreateAccountDto) {
    return await this.createSavingsAccount.execute(user, dto.name);
  }

  /**
   * GET /client/accounts/:id
   * Récupérer un compte par son ID
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getAccount.execute(id);
  }

  /**
   * GET /client/accounts/:id/balance
   * Récupérer le solde d'un compte
   */
  @Get(':id/balance')
  async getBalanceById(@Param('id') id: string) {
    const balance = await this.getBalance.execute(id);
    return { balance };
  }

  /**
   * PATCH /client/accounts/:id
   * Modifier le nom d'un compte
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    // D'abord récupérer le compte
    const account = await this.getAccount.execute(id);
    if (account instanceof Error) {
      return account;
    }

    // Puis mettre à jour le nom
    return await this.updateAccountName.execute(account, dto.name);
  }

  /**
   * DELETE /client/accounts/:id
   * Supprimer un compte (si solde = 0 et pas le dernier compte)
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    // D'abord récupérer le compte
    const account = await this.getAccount.execute(id);
    if (account instanceof Error) {
      return account;
    }

    // Puis supprimer
    return await this.deleteAccount.execute(account);
  }
}
