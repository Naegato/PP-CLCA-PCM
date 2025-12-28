import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company';
import { DirectorCreateCompanyError } from '../../../errors/director-create-company';

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
