import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountDeleteError } from '../errors/account-delete.js';
import { AccountUpdateError } from '../errors/account-update.js';
export interface AccountRepository {
    save(account: Account): Promise<Account>;
    all(): Promise<Account[]>;
    delete(account: Account): Promise<Account | AccountDeleteError>;
    update(account: Account): Promise<Account | AccountUpdateError>;
    generateAccountNumber(): Promise<string>;
    findByOwner(owner: User): Promise<Account[] | null>;
    findById(id: string): Promise<Account | null>;
}
//# sourceMappingURL=account.d.ts.map