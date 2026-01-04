import { NotAdvisor } from "../../../errors/not-advisor";
export class AdvisorGetPendingLoans {
    loanRequestRepository;
    security;
    constructor(loanRequestRepository, security) {
        this.loanRequestRepository = loanRequestRepository;
        this.security = security;
    }
    async execute() {
        const advisor = this.security.getCurrentUser();
        if (!advisor.isAdvisor()) {
            return new NotAdvisor();
        }
        const loans = await this.loanRequestRepository.getAllByAdvisor(advisor);
        return loans;
    }
}
//# sourceMappingURL=advisor-get-pending-loans.js.map