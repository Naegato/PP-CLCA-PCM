import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company';
import { DirectorGetCompanyError } from '../../../errors/director-get-company';

export class DirectorGetCompany {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(id: string): Promise<Company | DirectorGetCompanyError> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      return new DirectorGetCompanyError(`Company with id ${id} not found.`);
    }
    return company;
  }
}
