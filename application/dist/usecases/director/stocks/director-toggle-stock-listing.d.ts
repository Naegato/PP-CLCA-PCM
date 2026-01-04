import { StockRepository } from '../../../repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { DirectorToggleStockListingError } from '../../../errors/director-toggle-stock-listing';
export declare class DirectorToggleStockListing {
    private readonly stockRepository;
    constructor(stockRepository: StockRepository);
    execute(stockId: string): Promise<Stock | DirectorToggleStockListingError>;
}
//# sourceMappingURL=director-toggle-stock-listing.d.ts.map