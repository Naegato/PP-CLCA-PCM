import { LoanRequestRepository } from "@pp-clca-pcm/application/repositories/request-loan";
import { User } from '@pp-clca-pcm/domain/entities/user';
import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
export declare class ClientRequestLoan {
    readonly loanRequestRepository: LoanRequestRepository;
    constructor(loanRequestRepository: LoanRequestRepository);
    execute(client: User, amount: number): Promise<LoanRequest | import("@pp-clca-pcm/domain/errors/loan-request-amount").LoanRequestAmountError>;
}
//# sourceMappingURL=client-request-loan.d.ts.map