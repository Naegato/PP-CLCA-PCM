import { LoanRequestRepository } from '@pp-clca-pcm/application';
import { User } from '@pp-clca-pcm/domain';
import { LoanRequest } from  '@pp-clca-pcm/domain';

export class ClientRequestLoan {
  public constructor (
    public readonly loanRequestRepository: LoanRequestRepository
  ) { };

  public async execute(client: User, amount: number) {
    const loanRequest = LoanRequest.create(client, amount);

    if (loanRequest instanceof Error) {
      return loanRequest;
    }

    const savedLoanRequest = await this.loanRequestRepository.save(loanRequest);

    return savedLoanRequest;
  }
}