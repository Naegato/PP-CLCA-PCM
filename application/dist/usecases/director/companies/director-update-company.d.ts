import { Company } from '@pp-clca-pcm/domain/entities/company';
import { CompanyRepository } from '../../../repositories/company';
import { DirectorUpdateCompanyError } from '../../../errors/director-update-company';
export declare class DirectorUpdateCompany {
    private readonly companyRepository;
    constructor(companyRepository: CompanyRepository);
    execute(id: string, name: string): Promise<Company | DirectorUpdateCompanyError>;
}
//# sourceMappingURL=director-update-company.d.ts.map