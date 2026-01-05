import { LoanRepository } from '@pp-clca-pcm/application/repositories/loan';
import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { RedisBaseRepository } from './base.js';
export declare class RedisLoanRepository extends RedisBaseRepository<Loan> implements LoanRepository {
    readonly prefix = "loan:";
    save(loan: Loan): Promise<Loan>;
    allByClient(client: User): Promise<Loan[]>;
    key(loan: Loan): string;
    protected instanticate(entity: Loan): Loan;
}
//# sourceMappingURL=loan.d.ts.map