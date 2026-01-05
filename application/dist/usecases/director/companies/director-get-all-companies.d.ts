import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company.js';
export declare class DirectorGetAllCompanies {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(): Promise<Company[]>;
}
//# sourceMappingURL=director-get-all-companies.d.ts.map