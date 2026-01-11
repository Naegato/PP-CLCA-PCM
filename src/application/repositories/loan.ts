import { Loan } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';

export interface LoanRepository {
  save(loan: Loan): Promise<Loan>,
  all(): Promise<Loan[]>,
  allByClient(client: User): Promise<Loan[]>
}