import { AccountDeleteError } from '@pp-clca-pcm/application/errors/account-delete';
import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { AccountUpdateError } from '@pp-clca-pcm/application/errors/account-update';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { InMemoryUserRepository } from '../user';
import { User } from '@pp-clca-pcm/domain/entities/user';
export declare class InMemoryAccountRepository implements AccountRepository {
    readonly inMemoryUserRepository: InMemoryUserRepository;
    readonly inMemoryAccounts: Account[];
    private lastAccountNumber;
    constructor(inMemoryUserRepository: InMemoryUserRepository);
    save(account: Account): Promise<Account>;
    all(): Promise<Account[]>;
    delete(account: Account): Promise<Account | AccountDeleteError>;
    update(account: Account): Promise<Account | AccountUpdateError>;
    generateAccountNumber(): Promise<string>;
    findByOwner(owner: User): Promise<Account[] | null>;
    findById(id: string): Promise<Account | null>;
}
//# sourceMappingURL=account.d.ts.map