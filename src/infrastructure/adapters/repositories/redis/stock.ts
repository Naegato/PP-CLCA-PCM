import { RedisClientType } from 'redis';
import { StockRepository } from '@pp-clca-pcm/application';
import { RedisBaseRepository } from './base';
import { Stock, Company } from '@pp-clca-pcm/domain';

export class RedisStockRepository extends RedisBaseRepository<Stock> implements StockRepository {
  readonly prefix = 'stock:';

  constructor(redisClient: RedisClientType) {
    super(redisClient);
  }

  async all(): Promise<Stock[]> {
    return super.all();
  }

  async getListedStocks(): Promise<Stock[]> {
    const allStocks = await this.all();
    return allStocks.filter(stock => stock.isListed);
  }

  async findById(id: string): Promise<Stock | null> {
    return this.fetchFromKey(this.key(id)).then(results => results.length ? results[0] : null);
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
    const key = this.key(stock);
    await this.redisClient.set(key, JSON.stringify(stock));
    return stock;
  }

  async delete(stockId: string): Promise<void> {
    await this.redisClient.del(this.key(stockId));
  }

  protected instanticate(entity: any): Stock {
    const company = Company.fromPrimitives({
      identifier: entity.company.identifier,
      name: entity.company.name,
    });

    return Stock.fromPrimitives({
      identifier: entity.identifier,
      symbol: entity.symbol,
      name: entity.name,
      isListed: entity.isListed,
      createdAt: new Date(entity.createdAt),
      company: company,
    });
  }
}