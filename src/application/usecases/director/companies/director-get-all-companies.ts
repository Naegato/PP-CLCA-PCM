import { Company } from '@pp-clca-pcm/domain';
import { CompanyRepository } from '../../../repositories/company.js';

export class DirectorGetAllCompanies {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }
}
