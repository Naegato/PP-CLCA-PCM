import { NotAdvisor } from "../../../errors/not-advisor";
import { LoanRequestRepository } from "../../../repositories/request-loan";
import { LoanRepository } from "../../../repositories/loan";
import { Security } from "../../../services/security";
import { Loan } from "@pp-clca-pcm/domain/entities/loan";
export declare class AdvisorGrantLoan {
    readonly loanRequestRepository: LoanRequestRepository;
    readonly loanRepository: LoanRepository;
    readonly security: Security;
    constructor(loanRequestRepository: LoanRequestRepository, loanRepository: LoanRepository, security: Security);
    execute(loanRequestId: string): Promise<NotAdvisor | Loan | null>;
}
//# sourceMappingURL=advisor-grant-loan.d.ts.map