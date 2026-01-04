import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { randomUUID } from "crypto";
import { RedisBaseRepository } from "../base";

export class RedisAccountRepository extends RedisBaseRepository<Account> implements AccountRepository {
	readonly prefix = 'account:';

	public async save(account: Account): Promise<Account> {
		const realAccount = Account.createFromRaw(
			randomUUID(),
			account.owner,
			account.type,
			account.iban,
			account.name,
			account.emittedTransactions,
			account.receivedTransactions,
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

	public async findByOwner(owner: User): Promise<Account[] | null> {
		const allAccounts = await this.all();
		const ownerAccounts = allAccounts.filter(
			account => account.owner.identifier === owner.identifier
		);
		return ownerAccounts.length > 0 ? ownerAccounts : null;
	}

	public async findById(id: string): Promise<Account | null> {
		const key = this.key(id);
		const value = await this.db.get(key);
		if (!value) return null;

		const data = JSON.parse(value);
		return this.instanticate(data);
	}

	protected instanticate(entity: Account): Account {
		return Account.createFromRaw(
			entity.identifier!,
			entity.owner,
			entity.type,
			entity.iban,
			entity.name,
			entity.emittedTransactions,
			entity.receivedTransactions,
		);
	}
}
