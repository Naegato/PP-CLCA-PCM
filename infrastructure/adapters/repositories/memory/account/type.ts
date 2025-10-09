import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';

export class AccountTypeRepositoryInMemory implements AccountTypeRepository {
  public readonly inMemoryAccountTypes: AccountType[] = [];

  getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType> {
    const existingType = this.inMemoryAccountTypes.find(type => type.name === name);

    if (existingType) {
      return Promise.resolve(existingType);
    }

    this.inMemoryAccountTypes.push(accountType);
    return Promise.resolve(accountType);
  }

  all(): Promise<AccountType[]> {
    return Promise.resolve(this.inMemoryAccountTypes);
  }
}