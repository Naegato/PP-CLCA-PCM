import { Company } from '@pp-clca-pcm/domain';
import { CompanyRepository } from '@pp-clca-pcm/application';

export class InMemoryCompanyRepository implements CompanyRepository {
  public companies: Company[] = [];

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

  async delete(id: string): Promise<void> {
    const index = this.companies.findIndex((c) => c.identifier === id);
    if (index !== -1) {
      this.companies.splice(index, 1);
    }
  }
}
