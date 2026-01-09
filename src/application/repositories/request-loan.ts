import { LoanRequest } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';

export interface LoanRequestRepository {
  save(loan: LoanRequest): Promise<LoanRequest>,
  all(): Promise<LoanRequest[]>
  get(id: string): Promise<LoanRequest | null>

  getAllByAdvisor(advisor: User): Promise<LoanRequest[]>
}
