import { Stock } from '@pp-clca-pcm/domain/entities/stock';

export interface StockRepository {
  all(): Promise<Stock[]>;
  findById(id: string): Promise<Stock | null>;
  findBySymbol(symbol: string): Promise<Stock | null>;
  save(stock: Stock): Promise<Stock>;
}
