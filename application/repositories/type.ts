import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '../errors/account-type-already-exist';

export interface AccountTypeRepository {
  all(): Promise<AccountType[]>;
  getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType>;
  save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError>;
}