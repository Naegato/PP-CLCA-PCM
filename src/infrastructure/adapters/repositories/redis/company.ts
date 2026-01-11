import { RedisBaseRepository } from './base.js';
import { RedisClientType } from 'redis';
import { CompanyRepository } from '@pp-clca-pcm/application';
import { Company } from '@pp-clca-pcm/domain';

export class RedisCompanyRepository extends RedisBaseRepository<Company> implements CompanyRepository {
  readonly prefix = 'company:';

  public constructor(
    redisClient: RedisClientType,
  ) {
    super(redisClient);
  }

  public async create(company: Company): Promise<Company> {
    const key = this.key(company);

    await this.redisClient.set(key, JSON.stringify(company));
    return company;
  }

  public async delete(id: string) {
    const key = this.key(id);

    await this.redisClient.del(key);
  }

  public async update(company: Company): Promise<Company> {
    const key = this.key(company);

    await this.redisClient.set(
      key,
      JSON.stringify(company),
    );

    return company;
  }

  protected instanticate(entity: Company): Company {
    return Company.fromPrimitives({
      identifier: entity.identifier ?? "",
      name: entity.name
    });
  }

  public async findById(id: string): Promise<Company | null> {
    const key = this.key(id);
    const data = await this.redisClient.get(key);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return this.instanticate(parsed);
  }

  public async findByName(name: string): Promise<Company | null> {
    const companies = await this.fetchFromKey(`${this.prefix}*`);
    return companies.find(company => company.name === name) || null;
  }

  public async findAll(): Promise<Company[]> {
    return this.fetchFromKey(`${this.prefix}*`);
  }
}
