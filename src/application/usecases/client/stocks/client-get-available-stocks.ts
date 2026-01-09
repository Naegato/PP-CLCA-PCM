import { StockRepository } from '../../../repositories/stock.js';
import { Stock } from '@pp-clca-pcm/domain';
import { MarketService } from '../../../services/market.js';

export class ClientGetAvailableStocks {
  constructor(
    private readonly stockRepository: StockRepository,
  ) {}

  public async execute(): Promise<Stock[]> {
    const availableStocks = await this.stockRepository.getListedStocks();
    return availableStocks;
  }
}