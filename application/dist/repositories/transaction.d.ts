import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
export interface TransactionRepository {
    save(transaction: Transaction): Promise<Transaction>;
    all(): Promise<Transaction[]>;
    delete(transaction: Transaction): Promise<Transaction>;
}
//# sourceMappingURL=transaction.d.ts.map