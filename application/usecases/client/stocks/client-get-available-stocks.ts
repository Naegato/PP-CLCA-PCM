import { StockRepository } from '../../../repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { MarketService } from '../../../services/market';

export class ClientGetAvailableStocks {
  constructor(
    private readonly stockRepository: StockRepository,
  ) {}

  public async execute(): Promise<Stock[]> {
    const availableStocks = await this.stockRepository.getListedStocks();
    return availableStocks;
  }
}