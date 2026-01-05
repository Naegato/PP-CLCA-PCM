import { PortfolioRepository } from '../../../repositories/portfolio.js';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { AccountRepository } from '../../../repositories/account.js';

export class ClientGetPortfolio {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string): Promise<Portfolio | null> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return null;
    }

    let portfolio = await this.portfolioRepository.findByAccountId(accountId);
    if (!portfolio) {
      return null;
    }

    return portfolio;
  }
}
