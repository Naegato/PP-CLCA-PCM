import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { AccountTypeAlreadyExistError } from './type';

export interface StockRepository {
  all(): Promise<Stock[]>;
  findBySymbol(symbol: string): Promise<Stock | null>;
  save(stock: Stock): Promise<Stock>;
}
