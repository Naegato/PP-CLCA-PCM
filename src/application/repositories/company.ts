import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyDeleteError } from '../errors/company-delete-error';

export interface CompanyRepository {
  save(company: Company): Promise<Company>;
  findById(id: string): Promise<Company | null>;
  findByName(name: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  update(company: Company): Promise<Company>;
  delete(company: Company): Promise<Company | CompanyDeleteError>;
}
