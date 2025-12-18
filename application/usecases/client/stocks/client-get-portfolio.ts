import { PortfolioRepository } from '../../../repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { AccountRepository } from '../../../repositories/account';

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
      portfolio = Portfolio.create(accountId);
      await this.portfolioRepository.save(portfolio);
    }

    return portfolio;
  }
}
