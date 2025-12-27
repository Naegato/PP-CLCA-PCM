import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { ClientGetBalanceAccountError } from '@pp-clca-pcm/application/errors/client-get-balance-account';

export class ClientGetBalanceAccount {
  public constructor(private readonly accountRepository: AccountRepository) {}

  public async execute(accountId: string): Promise<number> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new ClientGetBalanceAccountError('Account not found');
    }

    return account.balance;
  }
}
