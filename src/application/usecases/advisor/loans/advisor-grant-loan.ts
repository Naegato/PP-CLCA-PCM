import { NotAdvisor } from "../../../errors/not-advisor";
import { LoanRequestRepository } from "../../../repositories/request-loan";
import { LoanRepository } from "../../../repositories/loan";
import { Security } from "../../../services/security";
import { Loan } from "@pp-clca-pcm/domain/entities/loan";

export class AdvisorGrantLoan {
  public constructor(
    public readonly loanRequestRepository: LoanRequestRepository,
    public readonly loanRepository: LoanRepository,
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
    await this.loanRequestRepository.save(newLoanRequest);

    const loan = Loan.create(loanRequest.client, loanRequest.amount, advisor);
    const savedLoan = await this.loanRepository.save(loan);

    return savedLoan;
  }
}
