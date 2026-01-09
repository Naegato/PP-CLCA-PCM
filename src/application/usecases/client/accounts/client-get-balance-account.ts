import { AccountRepository } from '@pp-clca-pcm/application';
import { ClientGetBalanceAccountError } from '@pp-clca-pcm/application';

export class ClientGetBalanceAccount {
  public constructor(private readonly accountRepository: AccountRepository) {}

  public async execute(accountId: string) {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      return new ClientGetBalanceAccountError('Account not found');
    }

    if (account instanceof Error) {
      return account;
    }

    return account.balance;
  }
}
