import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { StockRepository } from '../../../repositories/stock';
import { DirectorCreateStockError } from '../../../errors/director-create-stock';
import { CompanyRepository } from '../../../repositories/company';
export declare class DirectorCreateStock {
    private readonly stockRepository;
    private readonly companyRepository;
    constructor(stockRepository: StockRepository, companyRepository: CompanyRepository);
    execute(symbol: string, name: string, companyId: string): Promise<Stock | DirectorCreateStockError>;
}
//# sourceMappingURL=director-create-stock.d.ts.map