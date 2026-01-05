import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
import { randomUUID } from "crypto";
import { RedisBaseRepository } from "../base.js";
export class RedisAccountRepository extends RedisBaseRepository {
    prefix = 'account:';
    async save(account) {
        const realAccount = Account.createFromRaw(randomUUID(), account.owner, account.type, account.iban, account.name, account.emittedTransactions, account.receivedTransactions);
        const key = this.key(realAccount);
        await this.db.set(key, JSON.stringify(realAccount), { NX: true });
        return realAccount;
    }
    async delete(account) {
        const key = this.key(account);
        const deleted = await this.db.del(key);
        if (deleted === 0) {
            return new AccountDeleteError(account.identifier);
        }
        return account;
    }
    async update(account) {
        const key = this.key(account);
        await this.db.set(key, JSON.stringify(account));
        return account;
    }
    async generateAccountNumber() {
        return `todo-i-guess`;
    }
    async findByOwner(owner) {
        const allAccounts = await this.all();
        const ownerAccounts = allAccounts.filter(account => account.owner.identifier === owner.identifier);
        return ownerAccounts.length > 0 ? ownerAccounts : null;
    }
    async findById(id) {
        const key = this.key(id);
        const value = await this.db.get(key);
        if (!value)
            return null;
        const data = JSON.parse(value);
        return this.instanticate(data);
    }
    instanticate(entity) {
        return Account.createFromRaw(entity.identifier, entity.owner, entity.type, entity.iban, entity.name, entity.emittedTransactions, entity.receivedTransactions);
    }
}
//# sourceMappingURL=account.js.map