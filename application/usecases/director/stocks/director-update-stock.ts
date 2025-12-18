import { StockRepository } from '../../../repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { DirectorUpdateStockError } from '../../../errors/director-update-stock';

export class DirectorUpdateStock {
  constructor(private readonly stockRepository: StockRepository) {}

  public async execute(
    stockId: string,
    name?: string,
    symbol?: string,
    isListed?: boolean,
  ): Promise<Stock | DirectorUpdateStockError> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      return new DirectorUpdateStockError(`Stock with id ${stockId} not found.`);
    }

    const props: { name?: string; symbol?: string; isListed?: boolean } = {};
    if (name !== undefined) props.name = name;
    if (symbol !== undefined) props.symbol = symbol;
    if (isListed !== undefined) props.isListed = isListed;

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
