import { Portfolio } from '@pp-clca-pcm/domain';
import { InvalidIbanError } from '@pp-clca-pcm/domain';

export interface PortfolioRepository {
  save(portfolio: Portfolio): Promise<Portfolio>;
  findByAccountId(accountId: string): Promise<Portfolio | InvalidIbanError | null>;
  findAllByStockId(stockId: string): Promise<Portfolio[]>;
}