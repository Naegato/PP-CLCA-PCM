import { StockRepository } from '@pp-clca-pcm/application/repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { RedisClientType } from 'redis';
import { Company } from '@pp-clca-pcm/domain/entities/company';

export class RedisStockRepository implements StockRepository {
  private readonly STOCK_KEY = 'stock';

  constructor(private readonly redisClient: RedisClientType) {}

  async all(): Promise<Stock[]> {
    const stockData = await this.redisClient.hGetAll(this.STOCK_KEY);
    return Object.values(stockData).map(data => this.mapToStock(JSON.parse(data)));
  }

  async getListedStocks(): Promise<Stock[]> {
    const allStocks = await this.all();
    return allStocks.filter(stock => stock.isListed);
  }

  async findById(id: string): Promise<Stock | null> {
    const stockData = await this.redisClient.hGet(this.STOCK_KEY, id);
    return stockData ? this.mapToStock(JSON.parse(stockData)) : null;
  }

  async findBySymbol(symbol: string): Promise<Stock | null> {
    const allStocks = await this.all();
    return allStocks.find(stock => stock.symbol === symbol.toUpperCase()) || null;
  }

  async findAllByCompanyId(companyId: string): Promise<Stock[]> {
    const allStocks = await this.all();
    return allStocks.filter(stock => stock.company.identifier === companyId);
  }

  async save(stock: Stock): Promise<Stock> {
    if (!stock.identifier) {
      throw new Error('Stock identifier is required to save.');
    }

    const stockData = {
      identifier: stock.identifier,
      symbol: stock.symbol,
      name: stock.name,
      isListed: stock.isListed,
      createdAt: stock.createdAt.toISOString(),
      company: {
        identifier: stock.company.identifier,
        name: stock.company.name,
      },
    };

    await this.redisClient.hSet(this.STOCK_KEY, stock.identifier, JSON.stringify(stockData));
    return stock;
  }

  async delete(stockId: string): Promise<void> {
    await this.redisClient.hDel(this.STOCK_KEY, stockId);
  }

  private mapToStock(data: any): Stock {
    const company = Company.fromPrimitives({
      identifier: data.company.identifier,
      name: data.company.name,
    });

    return Stock.fromPrimitives({
      identifier: data.identifier,
      symbol: data.symbol,
      name: data.name,
      isListed: data.isListed,
      createdAt: new Date(data.createdAt),
      company: company,
    });
  }
}
