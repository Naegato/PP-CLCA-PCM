import { NotAdvisor } from "../../../errors/not-advisor.js";
import { LoanRequestRepository } from "../../../repositories/request-loan.js";
import { Security } from "../../../services/security.js";

export class AdvisorRejectLoan {
  public constructor(
    public readonly loanRequestRepository: LoanRequestRepository,
	public readonly security: Security,
  ) {}

  public async execute(loanRequestId: string) {
	const advisor = await this.security.getCurrentUser();

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
