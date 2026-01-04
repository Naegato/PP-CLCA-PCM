import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { ClientGetBalanceAccountError } from '@pp-clca-pcm/application/errors/client-get-balance-account';

export class ClientGetBalanceAccount {
  public constructor(private readonly accountRepository: AccountRepository) {}

  public async execute(accountId: string) {
    console.log('ClientGetBalanceAccount: execute called with accountId:', accountId);
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      console.log('ClientGetBalanceAccount: Account not found for ID', accountId);
      return new ClientGetBalanceAccountError('Account not found');
    }

    return account.balance;
  }
}
