import { CompanyRepository } from '../../../repositories/company.js';
import { StockRepository } from '../../../repositories/stock.js';
import { DirectorDeleteCompanyError } from '../../../errors/director-delete-company.js';
export declare class DirectorDeleteCompany {
    private readonly companyRepository;
    private readonly stockRepository;
    constructor(companyRepository: CompanyRepository, stockRepository: StockRepository);
    execute(id: string): Promise<void | DirectorDeleteCompanyError>;
}
//# sourceMappingURL=director-delete-company.d.ts.map