import { Controller, Post, Body, UseGuards, UseInterceptors, HttpCode } from '@nestjs/common';

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
    private readonly sendTransaction: ClientSendTransaction,
    private readonly getAccount: ClientGetAccount,
  ) {}

  /**
   * POST /client/transactions
   * Envoyer de l'argent d'un compte à un autre
   */
  @Post()
  @HttpCode(200)
  async send(@Body() dto: SendTransactionDto) {
    // Récupérer les deux comptes
    const senderAccount = await this.getAccount.execute(dto.senderAccountId);
    if (senderAccount instanceof Error) {
      return senderAccount;
    }

    const receiverAccount = await this.getAccount.execute(dto.receiverAccountId);
    if (receiverAccount instanceof Error) {
      return receiverAccount;
    }

    // Effectuer la transaction
    const newBalance = await this.sendTransaction.execute(
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
