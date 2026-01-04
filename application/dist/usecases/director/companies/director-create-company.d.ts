import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company';
import { DirectorCreateCompanyError } from '../../../errors/director-create-company';
export declare class DirectorCreateCompany {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(name: string): Promise<Company | DirectorCreateCompanyError>;
}
//# sourceMappingURL=director-create-company.d.ts.map