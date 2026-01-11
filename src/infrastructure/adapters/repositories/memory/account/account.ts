import { Account } from '@pp-clca-pcm/domain';
import { InMemoryUserRepository } from '../user/user.js';
import { ClientProps } from '@pp-clca-pcm/domain';
import { AccountDeleteError } from '@pp-clca-pcm/application';
import { AccountRepository } from '@pp-clca-pcm/application';
import { AccountUpdateError } from '@pp-clca-pcm/application';
import { FRENCH_IBAN_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';

export class InMemoryAccountRepository implements AccountRepository {
  public readonly inMemoryAccounts: Account[] = [];
  private lastAccountNumber = 0n;

  constructor(
    public readonly inMemoryUserRepository: InMemoryUserRepository,
  ) {}

  public async save(account: Account): Promise<Account> {
    const existingIndex = this.inMemoryAccounts.findIndex(
      (existingAccount) => existingAccount.identifier === account.identifier
    );

    if (existingIndex !== -1) {
      this.inMemoryAccounts[existingIndex] = account;
    } else {
      this.inMemoryAccounts.push(account);
    }

    const user = await this.inMemoryUserRepository.find(account.owner);

    if (user) {
      const updatedUser = user.updateClientProps(new ClientProps(
        [...(user.clientProps?.accounts ?? []), account]
      ));
      await this.inMemoryUserRepository.update(updatedUser);
    }

    return Promise.resolve(account);
  }

  public async all(): Promise<Account[]> {
    return Promise.resolve([...this.inMemoryAccounts]);
  }

  public async delete(account: Account): Promise<Account | AccountDeleteError> {
    const index = this.inMemoryAccounts.findIndex((acc) => acc.identifier === account.identifier);
    if (index === -1) {
      return new AccountDeleteError('Account not found');
    }

    const [deletedAccount] = this.inMemoryAccounts.splice(index, 1);

    return Promise.resolve(deletedAccount);
  }
  public async update(account: Account): Promise<Account | AccountUpdateError> {
    const index = this.inMemoryAccounts.findIndex((acc) => acc.identifier === account.identifier);
    if (index === -1) {
      return new AccountUpdateError('Account not found');
    }

    this.inMemoryAccounts[index] = account;

    return Promise.resolve(account);
  }

  public async generateAccountNumber(): Promise<string> {
    this.lastAccountNumber = this.lastAccountNumber + 1n;
    const accountNumberString = this.lastAccountNumber.toString();
    return accountNumberString.padStart(FRENCH_IBAN_ATTRIBUTES.ACCOUNT_NUMBER_LENGTH, '0');
  }

  public async findByOwner(owner: User): Promise<Account[] | null> {
    const accounts = this.inMemoryAccounts.filter(account => account.owner.identifier === owner.identifier);
    return Promise.resolve(accounts || null);
  }

  public async findById(id: string): Promise<Account | null> {
    const account = this.inMemoryAccounts.find(account => account.identifier === id);
    return Promise.resolve(account || null);
  }
}