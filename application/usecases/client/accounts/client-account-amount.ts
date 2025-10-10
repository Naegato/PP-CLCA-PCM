import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';

export class ClientAccountAmount {

  public async execute(account: Account): Promise<number> {
    const emitTransactions = account?.emittedTransactions ?? [];
    const receivedTransactions = account?.receivedTransactions ?? [];

    const emitAmount = emitTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const receivedAmount = receivedTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    return receivedAmount - emitAmount;
  }
}