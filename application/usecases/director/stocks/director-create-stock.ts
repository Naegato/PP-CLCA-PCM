import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { StockRepository } from '../../../repositories/stock.js';
import { DirectorCreateStockError } from '../../../errors/director-create-stock.js';
import { CompanyRepository } from '../../../repositories/company.js';

export class DirectorCreateStock {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  public async execute(symbol: string, name: string, companyId: string): Promise<Stock | DirectorCreateStockError> {
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
