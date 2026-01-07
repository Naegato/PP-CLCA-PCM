import { CompanyRepository } from '@pp-clca-pcm/application/repositories/company';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { RedisBaseRepository } from './base';
import { RedisClientType } from 'redis';
import { DirectorCreateCompanyError } from '@pp-clca-pcm/application/errors/director-create-company';
import { DirectorGetCompanyByIdError } from '@pp-clca-pcm/application/errors/director-get-company-by-id';
import { DirectorUpdateCompanyError } from '@pp-clca-pcm/application/errors/director-update-company';
import { DirectorDeleteCompanyError } from '@pp-clca-pcm/application/errors/director-delete-company';

export class RedisCompanyRepository extends RedisBaseRepository<Company> implements CompanyRepository {
  readonly prefix = 'company:';

  public constructor(
    redisClient: RedisClientType,
  ) {
    super(redisClient);
  }

  async save(company: Company): Promise<Company | DirectorCreateCompanyError> {
    const idKey = this.idKey(company.identifier);
    const nameKey = this.nameKey(company.name);

    const existingId = await this.redisClient.get(nameKey);
    if (existingId) return new DirectorCreateCompanyError(`Company with name ${company.name} already exists.`);

    await this.redisClient.set(idKey, JSON.stringify(company));
    await this.redisClient.set(nameKey, company.identifier);

    return company;
  }

  async all(): Promise<Company[]> {
    return super.all();
  }

  async findById(id: string): Promise<Company | DirectorGetCompanyByIdError> {
    const key = this.idKey(id);
    const data = await this.redisClient.get(key);
    if (!data) return new DirectorGetCompanyByIdError();
    const parsed = JSON.parse(data);
    return this.instanticate(parsed);
  }

  async findByName(name: string): Promise<Company | null> {
    const companyId = await this.redisClient.get(this.nameKey(name));
    if (!companyId) return null;

    return this.findById(companyId) as Promise<Company>;
  }

  async update(company: Company): Promise<Company | DirectorUpdateCompanyError> {
    const idKey = this.idKey(company.identifier);
    const existingData = await this.redisClient.get(idKey);
    if (!existingData) return new DirectorUpdateCompanyError();

    const oldCompany = JSON.parse(existingData);
    if (oldCompany.name !== company.name) {
      await this.redisClient.del(this.nameKey(oldCompany.name));
      await this.redisClient.set(this.nameKey(company.name), company.identifier);
    }

    await this.redisClient.set(idKey, JSON.stringify(company));
    return company;
  }

  async delete(companyId: string): Promise<void | DirectorDeleteCompanyError> {
    const idKey = this.idKey(companyId);
    const existingData = await this.redisClient.get(idKey);
    if (!existingData) return new DirectorDeleteCompanyError();

    const parsed = JSON.parse(existingData);
    await this.redisClient.del(idKey);
    await this.redisClient.del(this.nameKey(parsed.name));
  }

  protected idKey(id: string) { return `${this.prefix}id:${id}`; }
  protected nameKey(name: string) { return `${this.prefix}name:${name}`; }


  override instanticate(entity: any): Company {
    return Company.fromPrimitives({
      identifier: entity.identifier,
      name: entity.name,
    });
  }
}