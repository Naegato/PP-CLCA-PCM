import { NotAdvisor } from "../../../errors/not-advisor";
import { LoanRequestRepository } from "../../../repositories/request-loan";
import { Security } from "../../../services/security";

export class AdvisorGetPendingLoans {
  public constructor(
    public readonly loanRequestRepository: LoanRequestRepository,
    public readonly security: Security,
  ) {}

  public async execute() {
	const advisor = this.security.getCurrentUser();

	if (!advisor.isAdvisor()) {
		return new NotAdvisor();
	}

    const loans = await this.loanRequestRepository.getAllByAdvisor(advisor);

    return loans;
  }
}
