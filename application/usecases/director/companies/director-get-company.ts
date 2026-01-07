import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company';
import { DirectorGetCompanyByIdError } from '../../../errors/director-get-company-by-id';

export class DirectorGetCompany {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(id: string): Promise<Company | DirectorGetCompanyByIdError> {
    const company = await this.companyRepository.findById(id);
    if (company instanceof DirectorGetCompanyByIdError) {
      return company;
    }
    return company;
  }
}
