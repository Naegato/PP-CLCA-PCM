import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { StockRepository } from '../../../repositories/stock';
import { DirectorCreateStockError } from '../../../errors/director-create-stock';

export class DirectorCreateStock {
  constructor(private readonly stockRepository: StockRepository) {}

  public async execute(symbol: string, name: string): Promise<Stock | DirectorCreateStockError> {
    const existing = await this.stockRepository.findBySymbol(symbol);
    if (existing) {
      return new DirectorCreateStockError(`A stock with the symbol ${symbol} already exists.`);
    }

    const stock = Stock.create(symbol, name);
    return this.stockRepository.save(stock);
  }
}
