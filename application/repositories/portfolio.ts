import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';

export interface PortfolioRepository {
  save(portfolio: Portfolio): Promise<Portfolio>;
  findByAccountId(accountId: string): Promise<Portfolio | null>;
  findAllByStockId(stockId: string): Promise<Portfolio[]>;
}