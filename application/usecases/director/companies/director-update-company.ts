import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company';
import { DirectorUpdateCompanyError } from '../../../errors/director-update-company';
import { DirectorGetCompanyByIdError } from '../../../errors/director-get-company-by-id';

export class DirectorUpdateCompany {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(id: string, name: string): Promise<Company | DirectorUpdateCompanyError> {
    const company = await this.companyRepository.findById(id);
    if (company instanceof DirectorGetCompanyByIdError) {
      return new DirectorUpdateCompanyError(company.message);
    }

    const existing = await this.companyRepository.findByName(name);
    if (existing && existing.identifier !== id) {
      return new DirectorUpdateCompanyError(`A company with the name ${name} already exists.`);
    }

    const updatedCompany = company.update({ name });
    return this.companyRepository.update(updatedCompany);
  }
}
