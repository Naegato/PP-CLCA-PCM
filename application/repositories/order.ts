import { Order, OrderSide } from '@pp-clca-pcm/domain/entities/order';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  allByStock(stockId: string): Promise<Order[]>;
  findOpenOppositeOrders(stockId: string, side: OrderSide): Promise<Order[]>;
  findOpenBuyOrders(): Promise<Order[]>;
  findOpenSellOrders(): Promise<Order[]>;
}
