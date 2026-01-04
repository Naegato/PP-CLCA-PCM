export class InMemoryPortfolioRepository {
    portfolios = new Map();
    async findByAccountId(accountId) {
        for (const portfolio of this.portfolios.values()) {
            if (portfolio.account.identifier === accountId) {
                return portfolio;
            }
        }
        return null;
    }
    async save(portfolio) {
        this.portfolios.set(portfolio.identifier, portfolio);
        return portfolio;
    }
    async findAllByStockId(stockId) {
        const foundPortfolios = [];
        for (const portfolio of this.portfolios.values()) {
            if (portfolio.getOwnedQuantity(stockId) > 0) {
                foundPortfolios.push(portfolio);
            }
        }
        return Promise.resolve(foundPortfolios);
    }
}
//# sourceMappingURL=portfolio.js.map