import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { StockRepository } from '../../../repositories/stock.js';
import { DirectorCreateStockError } from '../../../errors/director-create-stock.js';
import { CompanyRepository } from '../../../repositories/company.js';
export declare class DirectorCreateStock {
    private readonly stockRepository;
    private readonly companyRepository;
    constructor(stockRepository: StockRepository, companyRepository: CompanyRepository);
    execute(symbol: string, name: string, companyId: string): Promise<Stock | DirectorCreateStockError>;
}
//# sourceMappingURL=director-create-stock.d.ts.map