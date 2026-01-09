import { LoanRepository } from '@pp-clca-pcm/application';
import { User } from '@pp-clca-pcm/domain';

export class ClientGetLoans {
  public constructor(
    public readonly loanRepository: LoanRepository
  ) {}

  public async execute(client: User) {
    const loans = await this.loanRepository.allByClient(client);

    return loans;
  }
}