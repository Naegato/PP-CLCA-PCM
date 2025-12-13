import { RedisClientType } from 'redis';
import { randomUUID } from 'crypto';

import { AccountTypeRepository } from "@pp-clca-pcm/application/repositories/type";
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';

export class RedisAccountTypeRepository implements AccountTypeRepository {
	readonly PREFIX = 'account_type:';

	constructor(private readonly db: RedisClientType) { }

	private key(account: AccountType | string): string {
		const id = typeof account === 'string' ? account : account.name;
		return `${this.PREFIX}${id}`;
	}

	async all(): Promise<AccountType[]> {
		const result: AccountType[] = [];

		for await (const key of this.db.scanIterator({ MATCH: `${this.PREFIX}*` })) {
			await Promise.all(key.map(async k => {
				const value = await this.db.get(k);
				if (!value) return;

				const data = JSON.parse(value);
				result.push(
					new AccountType(
						data.identifier,
						data.name,
						data.rate,
						data.limitByClient,
						data.description
					)
				);
			}))
		}

		return result;
	}

	async save(
		accountType: AccountType
	): Promise<AccountType | AccountTypeAlreadyExistError> {
		const realAccount = accountType.update({
			identifier: randomUUID(),
		});

		const key = this.key(realAccount);

		const created = await this.db.set(
			key,
			JSON.stringify(realAccount),
			{ NX: true }
		);

		if (created === null) {
			return new AccountTypeAlreadyExistError(realAccount.name);
		}

		return realAccount;
	}

	async getOrSave(
		name: AccountTypeName,
		accountType: AccountType
	): Promise<AccountType> {
		const key = this.key(name);

		const existing = await this.db.get(key);
		if (existing) {
			const data = JSON.parse(existing) as AccountType;
			return new AccountType(
				data.identifier,
				data.name,
				data.rate,
				data.limitByClient,
				data.description
			);
		}

		const saved = await this.save(accountType);

		if (saved instanceof AccountTypeAlreadyExistError) {
			const value = await this.db.get(key);
			if (!value) {
				throw new Error('AccountType exists but could not be retrieved');
			}

			const data = JSON.parse(value) as AccountType;
			return new AccountType(
				data.identifier,
				data.name,
				data.rate,
				data.limitByClient,
				data.description
			);
		}

		return saved;
	}
}
