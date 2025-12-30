import { NotAdvisor } from "../../../errors/not-advisor";
import { LoanRequestRepository } from "../../../repositories/request-loan";
import { Security } from "../../../services/security";

export class AdvisorGrantLoan {
  public constructor(
    public readonly loanRequestRepository: LoanRequestRepository,
	public readonly security: Security,
  ) {}

  public async execute(loanRequestId: string) {
	const advisor = this.security.getCurrentUser();

	if (!advisor.isAdvisor()) {
		return new NotAdvisor();
	}

	const loanRequest = await this.loanRequestRepository.get(loanRequestId);

	if (!loanRequest) {
		return null;
	}

	const newLoanRequest = loanRequest.grant(advisor);
	this.loanRequestRepository.save(newLoanRequest);

	// todo create loan entity

    return newLoanRequest;
  }
}
