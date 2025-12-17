import { RedisClientType } from 'redis';
import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
import { TransactionRepository } from '@pp-clca-pcm/application/repositories/transaction';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';

export class RedisTransactionRepository implements TransactionRepository {
	readonly PREFIX = 'transaction:';

	constructor(private readonly db: RedisClientType) { }

	async save(entity: Transaction): Promise<Transaction> {
		const key = this.key(entity);

		await this.db.set(
			key,
			JSON.stringify(entity),
			{ NX: true }
		);

		return entity;
	}

	async all(): Promise<Transaction[]> {
		return this.fetchFromKey(`${this.PREFIX}*`);
	}

	async delete(transaction: Transaction): Promise<Transaction> {
		const key = this.key(transaction);

		const result = await this.db.del(key);

		return transaction;
	}

	private async fetchFromKey(keyToSearch: string): Promise<Transaction[]> {
		const result: Transaction[] = [];

		for await (const key of this.db.scanIterator({ MATCH: keyToSearch })) {
			await Promise.all(key.map(async k => {
				const value = await this.db.get(k);
				if (!value) return;

				const data = JSON.parse(value);
				result.push(
					Transaction.fromPrimitives({
						identifier: data.identifier,
						identified: data.identified,
						amount: data.amount,
						date: data.date,
						description: data.description,
					})
				);
			}))
		}

		return result;
	}


	private key(entity: Transaction): string {
		return `${this.PREFIX}${entity.identifier}`;
	}
}
