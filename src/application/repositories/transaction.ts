import { Transaction } from '@pp-clca-pcm/domain';

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Transaction>
  all(): Promise<Transaction[]>
  delete(transaction: Transaction): Promise<Transaction>
}