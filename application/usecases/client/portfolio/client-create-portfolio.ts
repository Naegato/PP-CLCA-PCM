import { PortfolioRepository } from '../../../repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { AccountRepository } from '../../../repositories/account';
import { ClientCreatePortfolioError } from '@pp-clca-pcm/application/errors/client-create-portfolio';

export class ClientGetPortfolio {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(accountId: string) {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return new ClientCreatePortfolioError('Account not found.');
    }

    const portfolio = Portfolio.create(account);

    const savedPortfolio = await this.portfolioRepository.save(portfolio);

    return savedPortfolio;
  }
}
