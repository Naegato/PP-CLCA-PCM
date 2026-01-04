import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountDeleteError } from '@pp-clca-pcm/application/errors/account-delete';
import { AccountUpdateError } from '@pp-clca-pcm/application/errors/account-update';
import { PrismaClient } from './generated/client';
export declare class PrismaAccountRepository implements AccountRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    save(account: Account): Promise<Account>;
    all(): Promise<Account[]>;
    delete(account: Account): Promise<Account | AccountDeleteError>;
    update(account: Account): Promise<Account | AccountUpdateError>;
    generateAccountNumber(): Promise<string>;
    findByOwner(owner: User): Promise<Account[] | null>;
    findById(id: string): Promise<Account | null>;
    private toDomain;
}
//# sourceMappingURL=account.d.ts.map