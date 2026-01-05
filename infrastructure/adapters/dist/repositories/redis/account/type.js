import { randomUUID } from 'crypto';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { RedisBaseRepository } from '../base.js';
export class RedisAccountTypeRepository extends RedisBaseRepository {
    prefix = 'account_type:';
    async save(accountType) {
        const realAccount = accountType.update({
            identifier: randomUUID(),
        });
        const key = this.key(realAccount);
        const created = await this.db.set(key, JSON.stringify(realAccount), { NX: true });
        if (created === null) {
            return new AccountTypeAlreadyExistError(realAccount.name);
        }
        return realAccount;
    }
    async getOrSave(name, accountType) {
        const key = this.key(name);
        const existing = await this.db.get(key);
        if (existing) {
            const data = JSON.parse(existing);
            return this.instanticate(data);
        }
        const saved = await this.save(accountType);
        if (saved instanceof AccountTypeAlreadyExistError) {
            const value = await this.db.get(key);
            if (!value) {
                throw new Error('AccountType exists but could not be retrieved');
            }
            const data = JSON.parse(value);
            return this.instanticate(data);
        }
        return saved;
    }
    async update(accountType) {
        if (!accountType.identifier) {
            return new AccountTypeDoesNotExistError(accountType.name);
        }
        const key = this.key(accountType);
        const existing = await this.db.get(key);
        if (!existing) {
            return new AccountTypeDoesNotExistError(accountType.name);
        }
        await this.db.set(key, JSON.stringify(accountType));
        return accountType;
    }
    instanticate(entity) {
        return AccountType.createFromRaw(entity.identifier, entity.name, entity.rate, entity.limitByClient, entity.description);
    }
}
//# sourceMappingURL=type.js.map