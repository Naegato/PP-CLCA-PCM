import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
import { randomUUID } from "crypto";
import { RedisClientType } from "redis";

export class RedisAccountRepository implements AccountRepository {
	readonly PREFIX = 'account:';

	public constructor(
		private readonly db: RedisClientType,
	) {
	}

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

	public async all(): Promise<Account[]> {
		const result: Account[] = [];

		for await (const key of this.db.scanIterator({ MATCH: `${this.PREFIX}*` })) {
			await Promise.all(key.map(async k => {
				const value = await this.db.get(k);
				if (!value) return;

				const data = JSON.parse(value);
				result.push(
					new Account(
						data.identifier,
						data.owner,
						data.type,
						data.emittedTransactions,
						data.receivedTransactions,
						data.iban,
						data.name,
					)
				);
			}))
		}

		return result;
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

	private key(account: Account | string): string {
		const id = typeof account === 'string' ? account : account.identifier;
		return `${this.PREFIX}${id}`;
	}
}
