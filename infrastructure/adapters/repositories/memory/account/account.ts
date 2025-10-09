import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';

export class AccountRepositoryInMemory implements AccountRepository {
  public readonly inMemoryAccounts: Account[] = [];

  public async save(account: Account): Promise<Account> {
    this.inMemoryAccounts.push(account);

    return Promise.resolve(account);
  }

  public async all(): Promise<Account[]> {
    return Promise.resolve(this.inMemoryAccounts);
  }

}