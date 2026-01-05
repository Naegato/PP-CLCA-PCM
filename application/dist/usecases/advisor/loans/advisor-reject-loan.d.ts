import { NotAdvisor } from "../../../errors/not-advisor.js";
import { LoanRequestRepository } from "../../../repositories/request-loan.js";
import { Security } from "../../../services/security.js";
export declare class AdvisorRejectLoan {
    readonly loanRequestRepository: LoanRequestRepository;
    readonly security: Security;
    constructor(loanRequestRepository: LoanRequestRepository, security: Security);
    execute(loanRequestId: string): Promise<NotAdvisor | import("@pp-clca-pcm/domain/index").LoanRequest | null>;
}
//# sourceMappingURL=advisor-reject-loan.d.ts.map