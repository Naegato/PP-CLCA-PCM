import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company.js';
import { DirectorCreateCompanyError } from '../../../errors/director-create-company.js';
export declare class DirectorCreateCompany {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(name: string): Promise<Company | DirectorCreateCompanyError>;
}
//# sourceMappingURL=director-create-company.d.ts.map