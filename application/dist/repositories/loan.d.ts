import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { User } from '@pp-clca-pcm/domain/entities/user';
export interface LoanRepository {
    save(loan: Loan): Promise<Loan>;
    all(): Promise<Loan[]>;
    allByClient(client: User): Promise<Loan[]>;
}
//# sourceMappingURL=loan.d.ts.map