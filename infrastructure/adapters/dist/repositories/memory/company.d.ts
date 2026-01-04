import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '@pp-clca-pcm/application/repositories/company';
export declare class InMemoryCompanyRepository implements CompanyRepository {
    companies: Company[];
    create(company: Company): Promise<Company>;
    findById(id: string): Promise<Company | null>;
    findByName(name: string): Promise<Company | null>;
    findAll(): Promise<Company[]>;
    update(company: Company): Promise<Company>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=company.d.ts.map