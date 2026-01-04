import { PortfolioRepository } from '@pp-clca-pcm/application/repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
export declare class InMemoryPortfolioRepository implements PortfolioRepository {
    private readonly portfolios;
    findByAccountId(accountId: string): Promise<Portfolio | null>;
    save(portfolio: Portfolio): Promise<Portfolio>;
    findAllByStockId(stockId: string): Promise<Portfolio[]>;
}
//# sourceMappingURL=portfolio.d.ts.map