import { Company } from '@pp-clca-pcm/domain/entities/company';

export interface CompanyRepository {
  create(company: Company): Promise<Company>;
  findById(id: string): Promise<Company | null>;
  findByName(name: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  update(company: Company): Promise<Company>;
  delete(id: string): Promise<void>;
}
