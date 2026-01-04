import { CompanyRepository } from '../../../repositories/company';
import { StockRepository } from '../../../repositories/stock';
import { DirectorDeleteCompanyError } from '../../../errors/director-delete-company';
export declare class DirectorDeleteCompany {
    private readonly companyRepository;
    private readonly stockRepository;
    constructor(companyRepository: CompanyRepository, stockRepository: StockRepository);
    execute(id: string): Promise<void | DirectorDeleteCompanyError>;
}
//# sourceMappingURL=director-delete-company.d.ts.map