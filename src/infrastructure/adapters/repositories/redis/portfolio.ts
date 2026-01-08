import { RedisBaseRepository } from './base';
import { RedisClientType } from "redis";
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { PortfolioRepository } from '@pp-clca-pcm/application/repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';

export class RedisPortfolioRepository extends RedisBaseRepository<Portfolio> implements PortfolioRepository {
    readonly prefix = 'portfolio:';

    public constructor(
        redisClient: RedisClientType,
    ) {
        super(redisClient);
    }

    async save (portfolio: Portfolio): Promise<Portfolio> {
        const key = this.key(portfolio);

        await this.redisClient.set(key, JSON.stringify(portfolio.toPrimitives()));
        return portfolio;
    }

    protected instanticate(entity: any): Portfolio {
        return Portfolio.fromPrimitives(entity);
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
