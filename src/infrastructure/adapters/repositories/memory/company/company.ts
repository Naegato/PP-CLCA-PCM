import { Company } from '@pp-clca-pcm/domain';
import { CompanyRepository } from '@pp-clca-pcm/application';

export class InMemoryCompanyRepository implements CompanyRepository {
  public readonly companies: Company[] = [];

  async save(company: Company): Promise<Company> {
    const existingIndex = this.companies.findIndex(
      (existingCompany) => existingCompany  .identifier === company.identifier
    );

    if (existingIndex !== -1) {
      this.companies[existingIndex] = company;
    } else {
      this.companies.push(company);
    }

    return Promise.resolve(company);
  }

  async create(company: Company): Promise<Company> {
    this.companies.push(company);
    return company;
  }

  async findById(id: string): Promise<Company | null> {
    const company = this.companies.find((c) => c.identifier === id);
    return company || null;
  }

  async findByName(name: string): Promise<Company | null> {
    const company = this.companies.find((c) => c.name.toLowerCase() === name.toLowerCase());
    return company || null;
  }

  async findAll(): Promise<Company[]> {
    return this.companies;
  }

  async update(company: Company): Promise<Company> {
    const index = this.companies.findIndex((c) => c.identifier === company.identifier);
    if (index !== -1) {
      this.companies[index] = company;
    }
    return company;
  }

  async delete(id: string) {
    const index = this.companies.findIndex((c) => c.identifier === id);

    const deletedCompany = this.companies[index];
    this.companies.splice(index, 1);
  }
}
