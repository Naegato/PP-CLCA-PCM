import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';

export class ClientGetBalanceAccount {

  public async execute(account: Account): Promise<number> {
    return account.balance;
  }
}