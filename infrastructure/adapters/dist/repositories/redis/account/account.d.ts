import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { RedisBaseRepository } from "../base.js";
export declare class RedisAccountRepository extends RedisBaseRepository<Account> implements AccountRepository {
    readonly prefix = "account:";
    save(account: Account): Promise<Account>;
    delete(account: Account): Promise<Account | AccountDeleteError>;
    update(account: Account): Promise<Account>;
    generateAccountNumber(): Promise<string>;
    findByOwner(owner: User): Promise<Account[] | null>;
    findById(id: string): Promise<Account | null>;
    protected instanticate(entity: Account): Account;
}
//# sourceMappingURL=account.d.ts.map