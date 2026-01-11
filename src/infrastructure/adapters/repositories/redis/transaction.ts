import { TransactionRepository } from '@pp-clca-pcm/application';
import { Transaction } from '@pp-clca-pcm/domain';
import { RedisBaseRepository } from './base.js';

export class RedisTransactionRepository extends RedisBaseRepository<Transaction> implements TransactionRepository {
	readonly prefix = 'transaction:';

	public constructor(
		redisClient: RedisClientType,
	) {
		super(redisClient);
	}

  async save(entity: Transaction): Promise<Transaction> {
    const key = this.key(entity);

		await this.redisClient.set(
			key,
			JSON.stringify(entity),
			{ NX: true }
		);

    return entity;
  }

  async delete(transaction: Transaction): Promise<Transaction> {
    const key = this.key(transaction);

		const result = await this.redisClient.del(key);

    return transaction;
  }

	protected instanticate(entity: Transaction): Transaction {
		return Transaction.fromPrimitives({
			identifier: (entity as any).identifier as string,
			identified: (entity as any).identified as any,
			amount: (entity as any).amount as number,
			date: new Date((entity as any).date),
			description: (entity as any).description,
		})
	}
}
