import { Stock } from '@pp-clca-pcm/domain/entities/stock';
export interface StockRepository {
    all(): Promise<Stock[]>;
    getListedStocks(): Promise<Stock[]>;
    findById(id: string): Promise<Stock | null>;
    findBySymbol(symbol: string): Promise<Stock | null>;
    findAllByCompanyId(companyId: string): Promise<Stock[]>;
    save(stock: Stock): Promise<Stock>;
    delete(stockId: string): Promise<void>;
}
//# sourceMappingURL=stock.d.ts.map