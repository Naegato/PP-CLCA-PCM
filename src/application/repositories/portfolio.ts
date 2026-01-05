import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { InvalidIbanError } from '@pp-clca-pcm/domain/errors/invalid-iban-format';

export interface PortfolioRepository {
  save(portfolio: Portfolio): Promise<Portfolio>;
  findByAccountId(accountId: string): Promise<Portfolio | InvalidIbanError | null>;
  findAllByStockId(stockId: string): Promise<Portfolio[]>;
}