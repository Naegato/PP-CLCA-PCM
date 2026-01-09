import { Company } from '@pp-clca-pcm/domain';
import { CompanyRepository } from '@pp-clca-pcm/application';
import { PrismaClient } from '@pp-clca-pcm/adapters';

export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(company: Company): Promise<Company> {
    await this.db.company.create({
      data: {
        identifier: company.identifier,
        name: company.name,
      },
    });

    return company;
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.db.company.findUnique({
      where: { identifier: id },
    });

    if (!company) {
      return null;
    }

    return new (Company as any)(company.identifier, company.name);
  }

  async findByName(name: string): Promise<Company | null> {
    const company = await this.db.company.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!company) {
      return null;
    }

    return new (Company as any)(company.identifier, company.name);
  }

  async findAll(): Promise<Company[]> {
    const companies = await this.db.company.findMany();
    return companies.map(company => new (Company as any)(company.identifier, company.name));
  }

  async update(company: Company): Promise<Company> {
    await this.db.company.update({
      where: { identifier: company.identifier },
      data: {
        name: company.name,
      },
    });

    return company;
  }

  async delete(id: string): Promise<void> {
    await this.db.company.delete({
      where: { identifier: id },
    }).catch(() => {
      // Ignore errors if company doesn't exist
    });
  }
}
