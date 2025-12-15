import { Order, OrderSide } from '@pp-clca-pcm/domain/entities/order';
import { OrderRepository } from '@pp-clca-pcm/application/repositories/order';

export class InMemoryOrderRepository implements OrderRepository {
  public readonly orders: Order[] = [];

  save(order: Order): Promise<Order> {
    this.orders.push(order);
    return Promise.resolve(order);
  }

  allByStock(stockSymbol: string): Promise<Order[]> {
    const symbol = stockSymbol.toUpperCase();
    return Promise.resolve(this.orders.filter(o => o.stock.symbol === symbol));
  }

  findOpenOppositeOrders(stockSymbol: string, side: OrderSide): Promise<Order[]> {
    const symbol = stockSymbol.toUpperCase();
    const opposite = side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;

    const filtered = this.orders.filter(o => o.stock.symbol === symbol && o.side === opposite && o.remainingQuantity > 0 && !o.executed);
    return Promise.resolve(filtered);
  }
}
