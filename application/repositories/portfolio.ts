import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';

export interface PortfolioRepository {
  findByAccountId(accountId: string): Promise<Portfolio | null>;
  findAllByStockId(stockId: string): Promise<Portfolio[]>;
  save(portfolio: Portfolio): Promise<Portfolio>;
}