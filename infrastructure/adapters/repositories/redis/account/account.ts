import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { RedisBaseRepository } from "../base";

export class RedisAccountRepository extends RedisBaseRepository<Account> implements AccountRepository {
	readonly prefix = 'account:';

	public async save(account: Account): Promise<Account> {
		// Use domain factory to create persisted account (generates identifier)
		const realAccount = Account.create(
			account.owner,
			account.type,
			account.iban,
			account.name,
			(account as any).portfolio,
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
		const filtered = allAccounts.filter(a => a.owner?.identifier === owner.identifier);
		return filtered.length ? filtered : null;
	}

	public async findById(id: string): Promise<Account | null> {
		const key = this.key(id);
		const data = await this.db.get(key);
		if (!data) return null;
		const parsed = JSON.parse(data);
		return this.instanticate(parsed);
	}

	protected instanticate(entity: Account): Account {
		// Hydrate account from stored primitives
		return Account.fromPrimitives(entity as any);
	}
}
