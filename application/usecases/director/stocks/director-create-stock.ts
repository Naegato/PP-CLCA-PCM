import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { StockRepository } from '../../../repositories/stock';

export class DirectorCreateStock {
  constructor(private readonly stockRepository: StockRepository) {}

  public async execute(symbol: string, name: string): Promise<Stock> {
    const existing = await this.stockRepository.findBySymbol(symbol);
    if (existing) return existing;

    const stock = Stock.create(symbol, name);
    return this.stockRepository.save(stock);
  }
}
