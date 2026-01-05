import { PortfolioRepository } from '../../../repositories/portfolio.js';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { AccountRepository } from '../../../repositories/account.js';

export class ClientCreatePortfolio {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string): Promise<Portfolio | null> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return null;
    }

    const portfolio = Portfolio.create(account);

    const savedPortfolio = await this.portfolioRepository.save(portfolio);

    return savedPortfolio;
  }
}
