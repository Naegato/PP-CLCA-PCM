import { StockRepository } from '../../../repositories/stock.js';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
export declare class ClientGetAvailableStocks {
    private readonly stockRepository;
    constructor(stockRepository: StockRepository);
    execute(): Promise<Stock[]>;
}
//# sourceMappingURL=client-get-available-stocks.d.ts.map