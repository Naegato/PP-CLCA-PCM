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
        let portfolio = await this.portfolioRepository.findByAccountId(accountId);
        if (!portfolio) {
            return null;
        }
        return portfolio;
    }
}
//# sourceMappingURL=client-get-portfolio.js.map