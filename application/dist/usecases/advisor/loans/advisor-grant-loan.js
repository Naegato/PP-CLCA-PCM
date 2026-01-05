import { NotAdvisor } from "../../../errors/not-advisor.js";
import { Loan } from "@pp-clca-pcm/domain/entities/loan";
export class AdvisorGrantLoan {
    loanRequestRepository;
    loanRepository;
    security;
    constructor(loanRequestRepository, loanRepository, security) {
        this.loanRequestRepository = loanRequestRepository;
        this.loanRepository = loanRepository;
        this.security = security;
    }
    async execute(loanRequestId) {
        const advisor = this.security.getCurrentUser();
        if (!advisor.isAdvisor()) {
            return new NotAdvisor();
        }
        const loanRequest = await this.loanRequestRepository.get(loanRequestId);
        if (!loanRequest) {
            return null;
        }
        const newLoanRequest = loanRequest.grant(advisor);
        await this.loanRequestRepository.save(newLoanRequest);
        const loan = Loan.create(loanRequest.client, loanRequest.amount, advisor);
        const savedLoan = await this.loanRepository.save(loan);
        return savedLoan;
    }
}
//# sourceMappingURL=advisor-grant-loan.js.map