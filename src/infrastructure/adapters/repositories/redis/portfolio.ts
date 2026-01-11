import { RedisBaseRepository } from './base.js';
import { RedisClientType } from "redis";
import { PortfolioRepository } from '@pp-clca-pcm/application';
import { Portfolio } from '@pp-clca-pcm/domain';
import { PortfolioItem } from '@pp-clca-pcm/domain';

export class RedisPortfolioRepository extends RedisBaseRepository<Portfolio> implements PortfolioRepository {
    readonly prefix = 'portfolio:';

    public constructor(
      redisClient: RedisClientType,
    ) {
      super(redisClient);
    }

    async save(portfolio: Portfolio): Promise<Portfolio> {
      const key = this.key(portfolio);

      await this.redisClient.set(
        key,
        JSON.stringify({
        identifier: portfolio.identifier,
        account: portfolio.account,
        items: Array.from(portfolio.itemsIterator()).map(item => ({
            stock: item.stock,
            quantity: item.quantity,
        })),
        })
      );

      return portfolio;
    }

    protected instanticate(raw: any): Portfolio {
      const items = new Map<string, PortfolioItem>(
        raw.items.map((item: any) => [
        item.stock.identifier,
        PortfolioItem.create(item.stock, item.quantity),
        ])
      );

      return Portfolio.createFromRaw(
        raw.identifier,
        raw.account,
        items
      );
    }

    public async findById(id: string): Promise<Portfolio | null> {
      const key = this.key(id);
      const data = await this.redisClient.get(key);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return this.instanticate(parsed);
    }

    public async findAll(): Promise<Portfolio[]> {
      return this.fetchFromKey(`${this.prefix}*`);
    }

    public async findByAccountId(accountId: string): Promise<Portfolio | null> {
      const allPortfolios = await this.findAll();
      const portfolio = allPortfolios.find(p => p.account.identifier === accountId) || null;
      return portfolio;
    }

    public async findAllByStockId(stockId: string): Promise<Portfolio[]> {
      const allPortfolios = await this.findAll();
      return allPortfolios.filter(p => p.getOwnedQuantity(stockId) > 0);
    }
}
