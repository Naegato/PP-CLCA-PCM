import { Controller, Post, Body, UseGuards, UseInterceptors, HttpCode, Inject } from '@nestjs/common';

// Use cases
import { ClientSendTransaction } from '@pp-clca-pcm/application';
import { ClientGetAccount } from '@pp-clca-pcm/application';

// DTOs
import { SendTransactionDto } from '../dto/transactions/send-transaction.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { AccountRepository } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

/**
 * ClientTransactionsController
 *
 * Gère les transactions entre comptes:
 * - Envoyer de l'argent d'un compte à un autre
 */
@Controller('client/transactions')
@UseGuards(AuthGuard, RolesGuard)
@Roles('client')
@UseInterceptors(ErrorInterceptor)
export class ClientTransactionsController {
  constructor(
    @Inject(REPOSITORY_TOKENS.ACCOUNT)
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * POST /client/transactions
   * Envoyer de l'argent d'un compte à un autre
   */
  @Post()
  @HttpCode(200)
  async send(@Body() dto: SendTransactionDto) {
    // Récupérer les deux comptes
    const getAccountUseCase = new ClientGetAccount(this.accountRepository);

    const senderAccount = await getAccountUseCase.execute(dto.senderAccountId);
    if (senderAccount instanceof Error) {
      return senderAccount;
    }

    const receiverAccount = await getAccountUseCase.execute(dto.receiverAccountId);
    if (receiverAccount instanceof Error) {
      return receiverAccount;
    }

    // Effectuer la transaction
    const sendTransactionUseCase = new ClientSendTransaction(this.accountRepository);
    const newBalance = await sendTransactionUseCase.execute(
      senderAccount,
      receiverAccount,
      dto.amount,
    );

    return {
      success: !(newBalance instanceof Error),
      newBalance: newBalance instanceof Error ? undefined : newBalance,
    };
  }
}
