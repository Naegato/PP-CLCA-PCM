import { TransactionRepository } from '@pp-clca-pcm/application/repositories/transaction';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { RedisBaseRepository } from './base.js';
export declare class RedisTransactionRepository extends RedisBaseRepository<Transaction> implements TransactionRepository {
    readonly prefix = "transaction:";
    save(entity: Transaction): Promise<Transaction>;
    delete(transaction: Transaction): Promise<Transaction>;
    protected instanticate(entity: Transaction): Transaction;
}
//# sourceMappingURL=transaction.d.ts.map