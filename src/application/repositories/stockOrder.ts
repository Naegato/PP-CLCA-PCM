import { StockOrder, OrderSide } from '@pp-clca-pcm/domain';
import { InvalidIbanError } from '@pp-clca-pcm/domain';

export interface StockOrderRepository {
  save(order: StockOrder): Promise<StockOrder>;
  allByStock(stockId: string): Promise<StockOrder[]>;
  findOpenBuyOrders(stockId?: string, price?: number): Promise<StockOrder[]>;
  findOpenSellOrders(stockId?: string, price?: number): Promise<StockOrder[]>;
  getCommittedSellQuantity(accountId: string, stockId: string): Promise<number>;
  findById(orderId: string): Promise<StockOrder | InvalidIbanError | null>;
  findAllByOwnerId(ownerId: string): Promise<StockOrder[]>;
  delete(orderId: string): Promise<void>;
  findAllByStockId(stockId: string): Promise<StockOrder[]>;
  deleteMany(orderIds: string[]): Promise<void>;
}
