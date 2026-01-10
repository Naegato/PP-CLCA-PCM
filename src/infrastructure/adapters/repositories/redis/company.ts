import { RedisBaseRepository } from './base.js';
import { RedisClientType } from "redis";
import { CompanyRepository } from '@pp-clca-pcm/application/repositories/company';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyDeleteError } from "@pp-clca-pcm/application/errors/company-delete-error";

export class RedisCompanyRepository extends RedisBaseRepository<Company> implements CompanyRepository {
    readonly prefix = 'company:';

    public constructor(
        redisClient: RedisClientType,
    ) {
        super(redisClient);
    }

    async save (company: Company): Promise<Company> {
        const key = this.key(company);

        await this.redisClient.set(key, JSON.stringify(company));
        return company;
    }

    public async delete(company: Company) {
        const key = this.key(company);

        const deleted = await this.redisClient.del(key);

        if (deleted === 0) {
            return new CompanyDeleteError(company.identifier!);
        }

        return company;
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
            identifier: entity.identifier,
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
