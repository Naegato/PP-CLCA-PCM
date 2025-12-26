import { StockRepository } from '../../../repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';

export class ClientGetAvailableStocks {
  constructor(private readonly stockRepository: StockRepository) {}

  public async execute(): Promise<Stock[]> {
    const allStocks = await this.stockRepository.all();
    const availableStocks = allStocks.filter(stock => stock.isListed);
    return availableStocks;
  }
}
