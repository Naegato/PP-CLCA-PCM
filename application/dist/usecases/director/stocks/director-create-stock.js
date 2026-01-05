import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { DirectorCreateStockError } from '../../../errors/director-create-stock.js';
export class DirectorCreateStock {
    stockRepository;
    companyRepository;
    constructor(stockRepository, companyRepository) {
        this.stockRepository = stockRepository;
        this.companyRepository = companyRepository;
    }
    async execute(symbol, name, companyId) {
        const existing = await this.stockRepository.findBySymbol(symbol);
        if (existing) {
            return new DirectorCreateStockError(`A stock with the symbol ${symbol} already exists.`);
        }
        const company = await this.companyRepository.findById(companyId);
        if (!company) {
            return new DirectorCreateStockError(`Company with id ${companyId} not found.`);
        }
        const stock = Stock.create(symbol, name, company);
        return this.stockRepository.save(stock);
    }
}
//# sourceMappingURL=director-create-stock.js.map