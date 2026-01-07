import { StockRepository } from '../../../repositories/stock.js';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { DirectorUpdateStockError } from '../../../errors/director-update-stock.js';
import { CompanyRepository } from '../../../repositories/company.js';
import { Company } from '@pp-clca-pcm/domain/entities/company';

export class DirectorUpdateStock {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  public async execute(
    stockId: string,
    name?: string,
    symbol?: string,
    isListed?: boolean,
    companyId?: string,
  ): Promise<Stock | DirectorUpdateStockError> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      return new DirectorUpdateStockError(`Stock with id ${stockId} not found.`);
    }

    const props: { name?: string; symbol?: string; isListed?: boolean, company?: Company } = {};
    if (name !== undefined) props.name = name;
    if (symbol !== undefined) props.symbol = symbol;
    if (isListed !== undefined) props.isListed = isListed;

    if (companyId) {
      const company = await this.companyRepository.findById(companyId);
      if (!company) {
        return new DirectorUpdateStockError(`Company with id ${companyId} not found.`);
      }
      props.company = company;
    }

    if (props.symbol && props.symbol !== stock.symbol) {
      const existingStockWithSymbol = await this.stockRepository.findBySymbol(props.symbol);
      if (existingStockWithSymbol && existingStockWithSymbol.identifier !== stockId) {
        return new DirectorUpdateStockError(`Stock with symbol ${props.symbol} already exists.`);
      }
    }

    const updatedStock = stock.update(props);

    return this.stockRepository.save(updatedStock);
  }
}
