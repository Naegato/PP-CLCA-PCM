import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
import { randomUUID } from "crypto";
import { RedisClientType } from "redis";
import { RedisBaseRepository } from "../base";

export class RedisAccountRepository extends RedisBaseRepository<Account> implements AccountRepository {
	readonly prefix = 'account:';

	public async save(account: Account): Promise<Account> {
		const realAccount = new Account(
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
		return new Account(
			entity.identifier,
			entity.owner,
			entity.type,
			entity.emittedTransactions,
			entity.receivedTransactions,
			entity.iban,
			entity.name,
		);
	}
}
