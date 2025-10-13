import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';

export interface LoanRequestRepository {
  save(loan: LoanRequest): Promise<LoanRequest>,
  all(): Promise<LoanRequest[]>
}