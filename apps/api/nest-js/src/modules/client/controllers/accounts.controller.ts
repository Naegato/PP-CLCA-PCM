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
  Inject,
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

// Repositories & Services
import type { AccountRepository, AccountTypeRepository, UserRepository } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

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
    @Inject(REPOSITORY_TOKENS.ACCOUNT)
    private readonly accountRepository: AccountRepository,
    @Inject(REPOSITORY_TOKENS.ACCOUNT_TYPE)
    private readonly accountTypeRepository: AccountTypeRepository,
    @Inject(REPOSITORY_TOKENS.USER)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * POST /client/accounts
   * Créer un nouveau compte normal
   */
  @Post()
  @HttpCode(201)
  async create(@CurrentUser() user: User, @Body() dto: CreateAccountDto) {
    // Récupérer le type de compte "normal"
    const accountTypes = await this.accountTypeRepository.all();
    const accountType = accountTypes.find((at) => at.identifier === 'normal');
    if (!accountType) {
      return new Error('Account type "normal" not found');
    }

    const useCase = new ClientCreateAccount(accountType, this.accountRepository);
    return await useCase.execute(user, dto.name);
  }

  /**
   * POST /client/accounts/savings
   * Créer un nouveau compte épargne
   */
  @Post('savings')
  @HttpCode(201)
  async createSavings(@CurrentUser() user: User, @Body() dto: CreateAccountDto) {
    // Récupérer le type de compte "savings"
    const accountTypes = await this.accountTypeRepository.all();
    const accountType = accountTypes.find((at) => at.identifier === 'savings');
    if (!accountType) {
      return new Error('Account type "savings" not found');
    }

    const useCase = new ClientSavingAccountCreate(accountType, this.accountRepository);
    return await useCase.execute(user, dto.name);
  }

  /**
   * GET /client/accounts/:id
   * Récupérer un compte par son ID
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    const useCase = new ClientGetAccount(this.accountRepository);
    return await useCase.execute(id);
  }

  /**
   * GET /client/accounts/:id/balance
   * Récupérer le solde d'un compte
   */
  @Get(':id/balance')
  async getBalanceById(@Param('id') id: string) {
    const useCase = new ClientGetBalanceAccount(this.accountRepository);
    const balance = await useCase.execute(id);
    return { balance };
  }

  /**
   * PATCH /client/accounts/:id
   * Modifier le nom d'un compte
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    // D'abord récupérer le compte
    const getAccountUseCase = new ClientGetAccount(this.accountRepository);
    const account = await getAccountUseCase.execute(id);
    if (account instanceof Error) {
      return account;
    }

    // Puis mettre à jour le nom
    const updateUseCase = new ClientUpdateNameAccount(this.accountRepository);
    return await updateUseCase.execute(account, dto.name);
  }

  /**
   * DELETE /client/accounts/:id
   * Supprimer un compte (si solde = 0 et pas le dernier compte)
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    // D'abord récupérer le compte
    const getAccountUseCase = new ClientGetAccount(this.accountRepository);
    const account = await getAccountUseCase.execute(id);
    if (account instanceof Error) {
      return account;
    }

    // Puis supprimer
    const deleteUseCase = new ClientDeleteAccount(this.accountRepository, this.userRepository);
    return await deleteUseCase.execute(account);
  }
}
