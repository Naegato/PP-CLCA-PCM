import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';

export interface StockOrderRepository {
  save(order: StockOrder): Promise<StockOrder>;
  allByStock(stockId: string): Promise<StockOrder[]>;
  findOpenOppositeOrders(stockId: string, side: OrderSide, price?: number): Promise<StockOrder[]>;
  findOpenBuyOrders(): Promise<StockOrder[]>;
  findOpenSellOrders(): Promise<StockOrder[]>;
  getCommittedSellQuantity(accountId: string, stockId: string): Promise<number>;
  findById(orderId: string): Promise<StockOrder | null>;
  findAllByOwnerId(ownerId: string): Promise<StockOrder[]>;
  delete(orderId: string): Promise<void>;
  findAllByStockId(stockId: string): Promise<StockOrder[]>;
  deleteMany(orderIds: string[]): Promise<void>;
}
