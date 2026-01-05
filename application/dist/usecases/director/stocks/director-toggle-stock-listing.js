import { DirectorToggleStockListingError } from '../../../errors/director-toggle-stock-listing.js';
export class DirectorToggleStockListing {
    stockRepository;
    constructor(stockRepository) {
        this.stockRepository = stockRepository;
    }
    async execute(stockId) {
        const stock = await this.stockRepository.findById(stockId);
        if (!stock) {
            return new DirectorToggleStockListingError(`Stock with id ${stockId} not found.`);
        }
        const updatedStock = stock.toggleListed();
        return this.stockRepository.save(updatedStock);
    }
}
//# sourceMappingURL=director-toggle-stock-listing.js.map