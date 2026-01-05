import { AccountTypeRepository } from "@pp-clca-pcm/application/repositories/type";
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { RedisBaseRepository } from '../base.js';
export declare class RedisAccountTypeRepository extends RedisBaseRepository<AccountType> implements AccountTypeRepository {
    readonly prefix = "account_type:";
    save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError>;
    getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType>;
    update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError>;
    protected instanticate(entity: AccountType): AccountType;
}
//# sourceMappingURL=type.d.ts.map