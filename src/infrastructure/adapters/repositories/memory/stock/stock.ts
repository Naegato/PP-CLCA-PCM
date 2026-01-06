import { StockRepository } from '@pp-clca-pcm/application/repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';

export class InMemoryStockRepository implements StockRepository {
  public readonly stocks: Stock[] = [];

  all(): Promise<Stock[]> {
    return Promise.resolve([...this.stocks]);
  }

  getListedStocks(): Promise<Stock[]> {
    return Promise.resolve(this.stocks.filter(stock => stock.isListed));
  }

  findById(id: string): Promise<Stock | null> {
    const found = this.stocks.find(stock => stock.identifier === id) ?? null;
    return Promise.resolve(found);
  }

  findBySymbol(symbol: string): Promise<Stock | null> {
    const found = this.stocks.find(stock => stock.symbol === symbol.toUpperCase()) ?? null;
    return Promise.resolve(found);
  }

  save(stock: Stock): Promise<Stock> {
    const existingIndex = this.stocks.findIndex(s => s.identifier === stock.identifier);
    if (existingIndex !== -1) {
      this.stocks[existingIndex] = stock;
    } else {
      this.stocks.push(stock);
    }
    return Promise.resolve(stock);
  }

  async delete(stockId: string): Promise<void> {
    const index = this.stocks.findIndex(stock => stock.identifier === stockId);
    if (index !== -1) {
      this.stocks.splice(index, 1);
    }
    return Promise.resolve();
  }

  findAllByCompanyId(companyId: string): Promise<Stock[]> {
    const found = this.stocks.filter(stock => stock.company.identifier === companyId);
    return Promise.resolve(found);
  }
}
