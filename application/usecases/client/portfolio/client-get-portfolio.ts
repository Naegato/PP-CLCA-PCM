import { PortfolioRepository } from '../../../repositories/portfolio';
import { AccountRepository } from '../../../repositories/account';
import { ClientGetPortfolioError } from '@pp-clca-pcm/application/errors/client-get-portfolio';

export class ClientGetPortfolio {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string) {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return new ClientGetPortfolioError('Account not found.');
    }

    let portfolio = await this.portfolioRepository.findByAccountId(accountId);
    if (!portfolio) {
      return new ClientGetPortfolioError('Portfolio not found.');
    }

    return portfolio;
  }
}
