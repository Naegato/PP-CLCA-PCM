import { randomUUID } from 'crypto';
import { AccountTypeRepository } from "@pp-clca-pcm/application/repositories/type";
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { RedisBaseRepository } from '../base';
import { RedisClientType } from "redis";

export class RedisAccountTypeRepository extends RedisBaseRepository<AccountType> implements AccountTypeRepository {
	readonly prefix = 'account_type:';

	public constructor(
		redisClient: RedisClientType,
	) {
		super(redisClient);
	}

	async save(
		accountType: AccountType
	): Promise<AccountType | AccountTypeAlreadyExistError> {
		const realAccount = accountType.update({
			identifier: randomUUID(),
		});

		const key = this.key(realAccount);

		const created = await this.redisClient.set(
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

		const existing = await this.redisClient.get(key);
		if (existing) {
			const data = JSON.parse(existing) as AccountType;
			this.instanticate(data);
		}

		const saved = await this.save(accountType);

		if (saved instanceof AccountTypeAlreadyExistError) {
			const value = await this.redisClient.get(key);
			if (!value) {
				throw new Error('AccountType exists but could not be retrieved');
			}

			const data = JSON.parse(value) as AccountType;
			return this.instanticate(data);
		}

		return saved;
	}

	async update(accountType: AccountType): Promise<AccountType> {
		const key = this.key(accountType);

		await this.redisClient.set(
			key,
			JSON.stringify(accountType),
		);

		return accountType;
	}

	async all(): Promise<AccountType[]> {
		const result: AccountType[] = [];
		for await (const keysBatch of this.redisClient.scanIterator({ MATCH: `${this.prefix}*` })) {
            for (const key of keysBatch) {
                const value = await this.redisClient.get(key);
                if (!value) continue;
                const data = JSON.parse(value);
                result.push(this.instanticate(data));
            }
		}
		return result;
	}

	async findByName(name: AccountTypeName): Promise<AccountType | null> {
		for await (const keysBatch of this.redisClient.scanIterator({ MATCH: `${this.prefix}*` })) {
            for (const key of keysBatch) {
                const value = await this.redisClient.get(key);
                if (value) {
                    const accountType = this.instanticate(JSON.parse(value));
                    if (accountType.name === name) {
                        return accountType;
                    }
                }
            }
		}
		return null;
	}

	protected instanticate(entity: AccountType): AccountType {
		return AccountType.fromPrimitives({
			identifier: entity.identifier,
			name: entity.name,
			rate: entity.rate,
			limitByClient: entity.limitByClient,
			description: entity.description,
		});
	}
}
