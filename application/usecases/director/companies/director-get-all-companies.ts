import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company';

export class DirectorGetAllCompanies {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(): Promise<Company[]> {
    return this.companyRepository.all();
  }
}
