import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company.js';
import { DirectorGetCompanyError } from '../../../errors/director-get-company.js';
export declare class DirectorGetCompany {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(id: string): Promise<Company | DirectorGetCompanyError>;
}
//# sourceMappingURL=director-get-company.d.ts.map