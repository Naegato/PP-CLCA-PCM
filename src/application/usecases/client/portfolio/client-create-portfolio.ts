import { PortfolioRepository } from '../../../repositories/portfolio.js';
import { Portfolio } from '@pp-clca-pcm/domain';
import { AccountRepository } from '../../../repositories/account.js';
import { ClientCreatePortfolioError } from '@pp-clca-pcm/application';

export class ClientCreatePortfolio {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string) {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      return new ClientCreatePortfolioError('Account not found.');
    }

    if (account instanceof Error) {
      return account;
    }

    const portfolio = Portfolio.create(account);

    const savedPortfolio = await this.portfolioRepository.save(portfolio);

    return savedPortfolio;
  }
}
