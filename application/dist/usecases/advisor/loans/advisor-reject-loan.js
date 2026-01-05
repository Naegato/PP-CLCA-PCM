import { NotAdvisor } from "../../../errors/not-advisor.js";
export class AdvisorRejectLoan {
    loanRequestRepository;
    security;
    constructor(loanRequestRepository, security) {
        this.loanRequestRepository = loanRequestRepository;
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
        const newLoanRequest = loanRequest.reject(advisor);
        this.loanRequestRepository.save(newLoanRequest);
        return newLoanRequest;
    }
}
//# sourceMappingURL=advisor-reject-loan.js.map