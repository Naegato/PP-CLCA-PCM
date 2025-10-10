import { AccountDeleteError } from '@pp-clca-pcm/application/errors/account-delete';
import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { AccountUpdateError } from '@pp-clca-pcm/application/errors/account-update';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { InMemoryUserRepository } from '../user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';

export class InMemoryAccountRepository implements AccountRepository {
  public readonly inMemoryAccounts: Account[] = [];

  constructor(
    public readonly inMemoryUserRepository: InMemoryUserRepository,
  ) {}

  public async save(account: Account): Promise<Account> {
    this.inMemoryAccounts.push(account);

    const user = await this.inMemoryUserRepository.find(account.owner);

    if (user) {
      const updatedUser = user.updateClientProps(new ClientProps(
        [...user.clientProps.accounts, account]
      ));
      await this.inMemoryUserRepository.update(updatedUser);
    }

    return Promise.resolve(account);
  }

  public async all(): Promise<Account[]> {
    return Promise.resolve(this.inMemoryAccounts);
  }

  public async delete(account: Account): Promise<Account | AccountDeleteError> {
    const index = this.inMemoryAccounts.findIndex((a) => a.identifier === account.identifier);
    if (index === -1) {
      return new AccountDeleteError('Account not found');
    }

    const [deletedAccount] = this.inMemoryAccounts.splice(index, 1);

    return Promise.resolve(deletedAccount);
  }
  public async update(account: Account): Promise<Account | AccountUpdateError> {
    const index = this.inMemoryAccounts.findIndex((a) => a.identifier === account.identifier);
    if (index === -1) {
      return new AccountUpdateError('Account not found');
    }

    this.inMemoryAccounts[index] = account;

    return Promise.resolve(account);
  }
}