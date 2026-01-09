import { Company } from '@pp-clca-pcm/domain';
import { CompanyRepository } from '../../../repositories/company.js';
import { DirectorCreateCompanyError } from '../../../errors/director-create-company.js';

export class DirectorCreateCompany {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(name: string): Promise<Company | DirectorCreateCompanyError> {
    const existing = await this.companyRepository.findByName(name);
    if (existing) {
      return new DirectorCreateCompanyError(`A company with the name ${name} already exists.`);
    }

    const company = Company.create(name);
    return this.companyRepository.create(company);
  }
}
