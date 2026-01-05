import { StockRepository } from '../../../repositories/stock.js';
import { Stock, StockSymbol } from '@pp-clca-pcm/domain/entities/stock';
import { MarketService } from '../../../services/market.js';
import { ClientGetStockWithPriceError } from '../../../errors/client-get-stock-with-price.js';

export type StockWithPrice = {
  identifier: string | null;
  symbol: StockSymbol;
  name: string;
  isListed: boolean;
  createdAt: Date;
  price: number;
};

export class ClientGetStockWithPrice {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly marketService: MarketService,
  ) {}

  public async execute(stockId: string): Promise<StockWithPrice> {
    const stock = await this.stockRepository.findById(stockId);

    if (!stock) {
      throw new ClientGetStockWithPriceError('Stock not found.');
    }

    let price: number;
    if (stock.identifier === null) {
      throw new ClientGetStockWithPriceError('Stock lacks identifier.');
    } else {
      price = await this.marketService.computePrice(stock.identifier);
    }

    return {
      identifier: stock.identifier,
      symbol: stock.symbol,
      name: stock.name,
      isListed: stock.isListed,
      createdAt: stock.createdAt,
      price: price,
    };
  }
}
