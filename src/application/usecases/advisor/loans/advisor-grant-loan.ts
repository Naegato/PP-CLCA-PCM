import { NotAdvisor } from "../../../errors/not-advisor.js";
import { LoanRequestRepository } from "../../../repositories/request-loan.js";
import { LoanRepository } from "../../../repositories/loan.js";
import { Security } from "../../../services/security.js";
import { Loan } from '@pp-clca-pcm/domain';

export class AdvisorGrantLoan {
  public constructor(
    public readonly loanRequestRepository: LoanRequestRepository,
    public readonly loanRepository: LoanRepository,
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

    const newLoanRequest = loanRequest.grant(advisor);
    await this.loanRequestRepository.save(newLoanRequest);

    const loan = Loan.create(loanRequest.client, loanRequest.amount, advisor);
    const savedLoan = await this.loanRepository.save(loan);

    return savedLoan;
  }
}
