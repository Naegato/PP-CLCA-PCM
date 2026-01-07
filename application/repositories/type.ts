import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '../errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '../errors/account-type-does-not-exist';

export interface AccountTypeRepository {
  all(): Promise<AccountType[]>;
  getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType>;
  save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError>;
  update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError>;
  findByName(name: AccountTypeName): Promise<AccountType | null>;
}