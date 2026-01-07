import { NotAdvisor } from "../../../errors/not-advisor.js";
import { LoanRequestRepository } from "../../../repositories/request-loan.js";
import { Security } from "../../../services/security.js";

export class AdvisorGetPendingLoans {
  public constructor(
    public readonly loanRequestRepository: LoanRequestRepository,
    public readonly security: Security,
  ) {}

  public async execute() {
	const advisor = await this.security.getCurrentUser();

	if (!advisor.isAdvisor()) {
		return new NotAdvisor();
	}

    const loans = await this.loanRequestRepository.getAllByAdvisor(advisor);

    return loans;
  }
}
