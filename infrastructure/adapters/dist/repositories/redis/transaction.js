import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { RedisBaseRepository } from './base';
export class RedisTransactionRepository extends RedisBaseRepository {
    prefix = 'transaction:';
    async save(entity) {
        const key = this.key(entity);
        await this.db.set(key, JSON.stringify(entity), { NX: true });
        return entity;
    }
    async delete(transaction) {
        const key = this.key(transaction);
        await this.db.del(key);
        return transaction;
    }
    instanticate(entity) {
        return Transaction.fromPrimitives({
            identifier: entity.identifier,
            identified: entity.identified,
            amount: entity.amount,
            date: entity.date,
            description: entity.description,
        });
    }
}
//# sourceMappingURL=transaction.js.map