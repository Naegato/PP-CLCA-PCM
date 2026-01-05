import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { PrismaClient } from './generated/client.js';
export declare class PrismaAccountTypeRepository implements AccountTypeRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    all(): Promise<AccountType[]>;
    getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType>;
    save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError>;
    update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError>;
    private toDomain;
}
//# sourceMappingURL=account-type.d.ts.map