import { Order, OrderSide } from '@pp-clca-pcm/domain/entities/order';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  allByStock(stockSymbol: string): Promise<Order[]>;
  findOpenOppositeOrders(stockSymbol: string, side: OrderSide): Promise<Order[]>;
}
