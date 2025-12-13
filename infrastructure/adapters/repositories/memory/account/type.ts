import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';

export class InMemoryAccountTypeRepository implements AccountTypeRepository {
  public readonly inMemoryAccountTypes: AccountType[] = [];

  save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError> {
    const typeAlreadyExist = this.inMemoryAccountTypes.find((type) => type.name === accountType.name);

    if (typeAlreadyExist) {
      return Promise.resolve(new AccountTypeAlreadyExistError());
    }

    this.inMemoryAccountTypes.push(accountType);
    return Promise.resolve(accountType);
  }

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