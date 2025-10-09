import { Client } from '@pp-clca-pcm/domain/entities/user/client';
import { AccountRepository } from '../../../repositories/account';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';

export class ClientAccountAmount {

  public async execute(client: Client): Promise<number> {
    const account: Account = client.account;
    const emitTransactions = account?.emittedTransactions ?? [];
    const receivedTransactions = account?.receivedTransactions ?? [];

    const emitAmount = emitTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const receivedAmount = receivedTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    return receivedAmount - emitAmount;
  }
}