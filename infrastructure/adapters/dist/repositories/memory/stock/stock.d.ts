import { StockRepository } from '@pp-clca-pcm/application/repositories/stock';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
export declare class InMemoryStockRepository implements StockRepository {
    readonly stocks: Stock[];
    all(): Promise<Stock[]>;
    getListedStocks(): Promise<Stock[]>;
    findById(id: string): Promise<Stock | null>;
    findBySymbol(symbol: string): Promise<Stock | null>;
    save(stock: Stock): Promise<Stock>;
    delete(stockId: string): Promise<void>;
    findAllByCompanyId(companyId: string): Promise<Stock[]>;
}
//# sourceMappingURL=stock.d.ts.map