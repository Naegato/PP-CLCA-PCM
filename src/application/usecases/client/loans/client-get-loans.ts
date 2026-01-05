import { LoanRepository } from '@pp-clca-pcm/application/repositories/loan';
import { User } from '@pp-clca-pcm/domain/entities/user';

export class ClientGetLoans {
  public constructor(
    public readonly loanRepository: LoanRepository
  ) {}

  public async execute(client: User) {
    const loans = await this.loanRepository.allByClient(client);

    return loans;
  }
}