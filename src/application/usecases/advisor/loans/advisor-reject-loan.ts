import { NotAdvisor } from "../../../errors/not-advisor";
import { LoanRequestRepository } from "../../../repositories/request-loan";
import { Security } from "../../../services/security";

export class AdvisorRejectLoan {
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

	const newLoanRequest = loanRequest.reject(advisor);

	this.loanRequestRepository.save(newLoanRequest);

    return newLoanRequest;
  }
}
