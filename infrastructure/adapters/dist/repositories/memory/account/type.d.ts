import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
export declare class InMemoryAccountTypeRepository implements AccountTypeRepository {
    readonly inMemoryAccountTypes: AccountType[];
    save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError>;
    getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType>;
    all(): Promise<AccountType[]>;
    update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError>;
}
//# sourceMappingURL=type.d.ts.map