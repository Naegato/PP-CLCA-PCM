import { RedisClientType } from 'redis';
import { TransactionRepository } from '@pp-clca-pcm/application/repositories/transaction';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { RedisBaseRepository } from './base';

export class RedisTransactionRepository extends RedisBaseRepository<Transaction> implements TransactionRepository {
	readonly prefix = 'transaction:';

	async save(entity: Transaction): Promise<Transaction> {
		const key = this.key(entity);

		await this.db.set(
			key,
			JSON.stringify(entity),
			{ NX: true }
		);

		return entity;
	}

	async delete(transaction: Transaction): Promise<Transaction> {
		const key = this.key(transaction);

		const result = await this.db.del(key);

		return transaction;
	}

	protected instanticate(entity: Transaction): Transaction {
		return Transaction.fromPrimitives({
			identifier: entity.identifier,
			accountId: entity.accountId,
			amount: entity.amount,
			date: entity.date,
			description: entity.description,
		})
	}
}
