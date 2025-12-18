import { Order, OrderSide } from '@pp-clca-pcm/domain/entities/order';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  allByStock(stockId: string): Promise<Order[]>;
  findOpenOppositeOrders(stockId: string, side: OrderSide, price?: number): Promise<Order[]>;
  findOpenBuyOrders(): Promise<Order[]>;
  findOpenSellOrders(): Promise<Order[]>;
  getCommittedSellQuantity(accountId: string, stockId: string): Promise<number>;
  findById(orderId: string): Promise<Order | null>;
  findAllByOwnerId(ownerId: string): Promise<Order[]>;
  delete(orderId: string): Promise<void>;
  findAllByStockId(stockId: string): Promise<Order[]>;
  deleteMany(orderIds: string[]): Promise<void>;
}
