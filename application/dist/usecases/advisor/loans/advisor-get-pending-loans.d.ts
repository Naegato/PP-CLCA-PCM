import { NotAdvisor } from "../../../errors/not-advisor.js";
import { LoanRequestRepository } from "../../../repositories/request-loan.js";
import { Security } from "../../../services/security.js";
export declare class AdvisorGetPendingLoans {
    readonly loanRequestRepository: LoanRequestRepository;
    readonly security: Security;
    constructor(loanRequestRepository: LoanRequestRepository, security: Security);
    execute(): Promise<NotAdvisor | import("@pp-clca-pcm/domain/index").LoanRequest[]>;
}
//# sourceMappingURL=advisor-get-pending-loans.d.ts.map