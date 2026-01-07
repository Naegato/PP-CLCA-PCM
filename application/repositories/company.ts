import { Company } from '@pp-clca-pcm/domain/entities/company';
import { DirectorCreateCompanyError } from '../errors/director-create-company';
import { DirectorDeleteCompanyError } from '../errors/director-delete-company';
import { DirectorGetCompanyByIdError } from '../errors/director-get-company-by-id';
import { DirectorUpdateCompanyError } from '../errors/director-update-company';

export interface CompanyRepository {
  save(company: Company): Promise<Company | DirectorCreateCompanyError>;
  all(): Promise<Company[]>;
  findById(id: string): Promise<Company | DirectorGetCompanyByIdError>;
  findByName(name: string): Promise<Company | null>;
  update(company: Company): Promise<Company | DirectorUpdateCompanyError>;
  delete(companyId: string): Promise<void | DirectorDeleteCompanyError>;
}