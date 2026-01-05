import { PortfolioRepository } from '../../../repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { AccountRepository } from '../../../repositories/account';

export class ClientCreatePortfolio {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string) {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      return null;
    }

    if (account instanceof Error) {
      return account;
    }

    const portfolio = Portfolio.create(account);

    const savedPortfolio = await this.portfolioRepository.save(portfolio);

    return savedPortfolio;
  }
}
