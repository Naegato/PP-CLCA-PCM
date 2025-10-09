import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';

export interface AccountRepository {
  save(account: Account): Promise<Account>;
  all(): Promise<Account[]>;
}