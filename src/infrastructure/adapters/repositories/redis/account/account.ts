import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { randomUUID } from "crypto";
import { RedisClientType } from "redis";
import { RedisBaseRepository } from "../base.js";

export class RedisAccountRepository extends RedisBaseRepository<Account> implements AccountRepository {
	readonly prefix = 'account:';

	public async save(account: Account): Promise<Account> {
		const realAccount = Account.createFromRaw(
			randomUUID(),
			account.owner,
			account.type,
			account.emittedTransactions,
			account.receivedTransactions,
			account.iban,
			account.name,
		);

		const key = this.key(realAccount);

		await this.db.set(
			key,
			JSON.stringify(realAccount),
			{ NX: true }
		);

		return realAccount;
	}

	public async all(): Promise<Account[]> {
		const keys = await this.db.keys(`${this.prefix}*`);
		const accounts: Account[] = [];

		for (const key of keys) {
			const value = await this.db.get(key);
			if (value) {
				const data = JSON.parse(value) as Account;
				accounts.push(this.instanticate(data));
			}
		}

		return accounts;
	}

	public async findByOwner(owner: User): Promise<Account[] | null> {
		const allAccounts = await this.all();
		const ownerAccounts = allAccounts.filter(acc => acc.owner.identifier === owner.identifier);
		return ownerAccounts.length > 0 ? ownerAccounts : null;
	}

	public async findById(id: string): Promise<Account | null> {
		const key = this.key({ identifier: id } as Account);
		const value = await this.db.get(key);

		if (!value) {
			return null;
		}

		const data = JSON.parse(value) as Account;
		return this.instanticate(data);
	}

	public async delete(account: Account): Promise<Account | AccountDeleteError> {
		const key = this.key(account);

		const deleted = await this.db.del(key);

		if (deleted === 0) {
			return new AccountDeleteError(account.identifier!);
		}

		return account;
	}

	public async update(account: Account): Promise<Account> {
		const key = this.key(account);

		await this.db.set(
			key,
			JSON.stringify(account),
		);

		return account;
	}

	public async generateAccountNumber(): Promise<string> {
		return `todo-i-guess`;
	}

	protected instanticate(entity: Account): Account {
		return Account.createFromRaw(
			entity.identifier!,
			entity.owner,
			entity.type,
			entity.emittedTransactions,
			entity.receivedTransactions,
			entity.iban,
			entity.name,
		);
	}
}
