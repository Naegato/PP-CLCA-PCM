import { NotAdvisor } from "../../../errors/not-advisor";
import { LoanRequestRepository } from "../../../repositories/request-loan";
import { Security } from "../../../services/security";
export declare class AdvisorGetPendingLoans {
    readonly loanRequestRepository: LoanRequestRepository;
    readonly security: Security;
    constructor(loanRequestRepository: LoanRequestRepository, security: Security);
    execute(): Promise<NotAdvisor | import("@pp-clca-pcm/domain/entities/loan-request").LoanRequest[]>;
}
//# sourceMappingURL=advisor-get-pending-loans.d.ts.map