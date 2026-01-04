import { LoanRepository } from '@pp-clca-pcm/application/repositories/loan';
import { User } from '@pp-clca-pcm/domain/entities/user';
export declare class ClientGetLoans {
    readonly loanRepository: LoanRepository;
    constructor(loanRepository: LoanRepository);
    execute(client: User): Promise<import("@pp-clca-pcm/domain/entities/loan").Loan[]>;
}
//# sourceMappingURL=client-get-loans.d.ts.map