import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '../errors/account-type-already-exist.js';
import { AccountTypeDoesNotExistError } from '../errors/account-type-does-not-exist.js';

export interface AccountTypeRepository {
  all(): Promise<AccountType[]>;
  getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType>;
  save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError>;
  update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError>;
}