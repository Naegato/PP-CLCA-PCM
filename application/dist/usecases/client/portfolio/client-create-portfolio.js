import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
export class ClientGetPortfolio {
    portfolioRepository;
    accountRepository;
    constructor(portfolioRepository, accountRepository) {
        this.portfolioRepository = portfolioRepository;
        this.accountRepository = accountRepository;
    }
    async execute(accountId) {
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            return null;
        }
        const portfolio = Portfolio.create(account);
        const savedPortfolio = await this.portfolioRepository.save(portfolio);
        return savedPortfolio;
    }
}
//# sourceMappingURL=client-create-portfolio.js.map