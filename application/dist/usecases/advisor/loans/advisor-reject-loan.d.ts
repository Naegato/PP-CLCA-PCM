import { NotAdvisor } from "../../../errors/not-advisor";
import { LoanRequestRepository } from "../../../repositories/request-loan";
import { Security } from "../../../services/security";
export declare class AdvisorRejectLoan {
    readonly loanRequestRepository: LoanRequestRepository;
    readonly security: Security;
    constructor(loanRequestRepository: LoanRequestRepository, security: Security);
    execute(loanRequestId: string): Promise<NotAdvisor | import("@pp-clca-pcm/domain/entities/loan-request").LoanRequest | null>;
}
//# sourceMappingURL=advisor-reject-loan.d.ts.map