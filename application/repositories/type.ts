import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';

export interface AccountTypeRepository {
  all(): Promise<AccountType[]>;
  getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType>;
}