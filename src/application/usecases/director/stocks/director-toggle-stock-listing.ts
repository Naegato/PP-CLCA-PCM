import { StockRepository } from '../../../repositories/stock.js';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { DirectorToggleStockListingError } from '../../../errors/director-toggle-stock-listing.js';

export class DirectorToggleStockListing {
  constructor(private readonly stockRepository: StockRepository) {}

  public async execute(stockId: string): Promise<Stock | DirectorToggleStockListingError> {
    const stock = await this.stockRepository.findById(stockId);
    if (!stock) {
      return new DirectorToggleStockListingError(`Stock with id ${stockId} not found.`);
    }

    const updatedStock = stock.toggleListed();

    return this.stockRepository.save(updatedStock);
  }
}
