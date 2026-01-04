import { StockRepository } from '../../../repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { DirectorUpdateStockError } from '../../../errors/director-update-stock';
import { CompanyRepository } from '../../../repositories/company';
export declare class DirectorUpdateStock {
    private readonly stockRepository;
    private readonly companyRepository;
    constructor(stockRepository: StockRepository, companyRepository: CompanyRepository);
    execute(stockId: string, name?: string, symbol?: string, isListed?: boolean, companyId?: string): Promise<Stock | DirectorUpdateStockError>;
}
//# sourceMappingURL=director-update-stock.d.ts.map