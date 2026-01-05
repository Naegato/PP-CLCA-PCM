import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
import { LoanRequestRepository } from '@pp-clca-pcm/application/repositories/request-loan';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { RedisBaseRepository } from './base.js';
export declare class RedisLoanRequestRepository extends RedisBaseRepository<LoanRequest> implements LoanRequestRepository {
    readonly prefix = "loan-request:";
    save(loan: LoanRequest): Promise<LoanRequest>;
    getAllByAdvisor(advisor: User): Promise<LoanRequest[]>;
    get(id: string): Promise<LoanRequest | null>;
    key(loan: LoanRequest): string;
    protected instanticate(entity: LoanRequest): LoanRequest;
}
//# sourceMappingURL=request-loan.d.ts.map