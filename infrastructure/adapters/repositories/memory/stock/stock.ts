import { StockRepository } from '@pp-clca-pcm/application/repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';

export class InMemoryStockRepository implements StockRepository {
  public readonly stocks: Stock[] = [];

  all(): Promise<Stock[]> {
    return Promise.resolve(this.stocks);
  }

  findBySymbol(symbol: string): Promise<Stock | null> {
    const found = this.stocks.find(s => s.symbol === symbol.toUpperCase()) ?? null;
    return Promise.resolve(found);
  }

  save(stock: Stock): Promise<Stock> {
    this.stocks.push(stock);
    return Promise.resolve(stock);
  }
}
