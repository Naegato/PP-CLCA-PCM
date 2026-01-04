import { StockRepository } from '../../../repositories/stock';
import { StockSymbol } from '@pp-clca-pcm/domain/entities/stock';
import { MarketService } from '../../../services/market';
export type StockWithPrice = {
    identifier: string | null;
    symbol: StockSymbol;
    name: string;
    isListed: boolean;
    createdAt: Date;
    price: number;
};
export declare class ClientGetStockWithPrice {
    private readonly stockRepository;
    private readonly marketService;
    constructor(stockRepository: StockRepository, marketService: MarketService);
    execute(stockId: string): Promise<StockWithPrice>;
}
//# sourceMappingURL=client-get-stock-with-price.d.ts.map