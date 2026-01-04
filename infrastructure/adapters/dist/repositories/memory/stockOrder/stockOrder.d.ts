import { StockOrder } from '@pp-clca-pcm/domain/entities/stockOrder';
import { StockOrderRepository } from '@pp-clca-pcm/application/repositories/stockOrder';
export declare class InMemoryStockOrderRepository implements StockOrderRepository {
    orders: StockOrder[];
    save(order: StockOrder): Promise<StockOrder>;
    allByStock(stockId: string): Promise<StockOrder[]>;
    findOpenBuyOrders(stockId?: string, price?: number): Promise<StockOrder[]>;
    findOpenSellOrders(stockId?: string, price?: number): Promise<StockOrder[]>;
    getCommittedSellQuantity(accountId: string, stockId: string): Promise<number>;
    findById(orderId: string): Promise<StockOrder | null>;
    findAllByOwnerId(ownerId: string): Promise<StockOrder[]>;
    delete(orderId: string): Promise<void>;
    findAllByStockId(stockId: string): Promise<StockOrder[]>;
    deleteMany(orderIds: string[]): Promise<void>;
}
//# sourceMappingURL=stockOrder.d.ts.map