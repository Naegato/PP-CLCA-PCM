import { PortfolioRepository } from '@pp-clca-pcm/application/repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';

export class InMemoryPortfolioRepository implements PortfolioRepository {
  private readonly portfolios: Map<string, Portfolio> = new Map();

  async findByAccountId(accountId: string): Promise<Portfolio | null> {
    for (const portfolio of this.portfolios.values()) {
      if (portfolio.accountId === accountId) {
        return portfolio;
      }
    }
    return null;
  }

  async save(portfolio: Portfolio): Promise<Portfolio> {
    this.portfolios.set(portfolio.identifier!, portfolio);
    return portfolio;
  }

  async findAllByStockId(stockId: string): Promise<Portfolio[]> {
    const foundPortfolios: Portfolio[] = [];
    for (const portfolio of this.portfolios.values()) {
      if (portfolio.getOwnedQuantity(stockId) > 0) {
        foundPortfolios.push(portfolio);
      }
    }
    return Promise.resolve(foundPortfolios);
  }
}
