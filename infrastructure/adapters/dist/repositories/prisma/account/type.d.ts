import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';
export declare class PrismaAccountTypeRepository implements AccountTypeRepository {
    private readonly db;
    constructor(db: PrismaClient);
    all(): Promise<AccountType[]>;
    getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType>;
    save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError>;
    update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError>;
}
//# sourceMappingURL=type.d.ts.map