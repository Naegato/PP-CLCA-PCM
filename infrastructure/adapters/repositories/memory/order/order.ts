import { Order, OrderSide } from '@pp-clca-pcm/domain/entities/order';
import { OrderRepository } from '@pp-clca-pcm/application/repositories/order';

export class InMemoryOrderRepository implements OrderRepository {
  public orders: Order[] = [];

  save(order: Order): Promise<Order> {
    const existingOrderIndex = this.orders.findIndex(existingOrder => existingOrder.identifier === order.identifier);
    if (existingOrderIndex !== -1) {
      this.orders[existingOrderIndex] = order;
    } else {
      this.orders.push(order);
    }
    return Promise.resolve(order);
  }

  allByStock(stockId: string): Promise<Order[]> {
    return Promise.resolve(this.orders.filter(order => order.stock.identifier === stockId));
  }

  findOpenOppositeOrders(stockId: string, side: OrderSide, price?: number): Promise<Order[]> {
    const oppositeSide = side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;

    let filtered = this.orders.filter(order =>
      order.stock.identifier === stockId &&
      order.side === oppositeSide &&
      order.remainingQuantity > 0
    );

    if (price !== undefined) {
      if (side === OrderSide.BUY) {
        filtered = filtered.filter(order => order.price <= price);
      } else {
        filtered = filtered.filter(order => order.price >= price);
      }
    }

    if (oppositeSide === OrderSide.SELL) {
      filtered.sort((a, b) => a.price - b.price);
    } else {
      filtered.sort((a, b) => b.price - a.price);
    }

    return Promise.resolve(filtered);
  }

  findOpenBuyOrders(): Promise<Order[]> {
    return Promise.resolve(this.orders.filter(order => order.side === OrderSide.BUY && order.remainingQuantity > 0));
  }

  findOpenSellOrders(): Promise<Order[]> {
    return Promise.resolve(this.orders.filter(order => order.side === OrderSide.SELL && order.remainingQuantity > 0));
  }

  getCommittedSellQuantity(accountId: string, stockId: string): Promise<number> {
    const sellOrders = this.orders.filter(order =>
      order.owner.identifier === accountId &&
      order.stock.identifier === stockId &&
      order.side === OrderSide.SELL &&
      order.remainingQuantity > 0
    );
    const committedQuantity = sellOrders.reduce((total, order) => total + order.remainingQuantity, 0);
    return Promise.resolve(committedQuantity);
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = this.orders.find(order => order.identifier === orderId);
    return Promise.resolve(order || null);
  }

  async findAllByOwnerId(ownerId: string): Promise<Order[]> {
    const orders = this.orders.filter(order => order.owner.identifier === ownerId);
    return Promise.resolve(orders);
  }

  async delete(orderId: string): Promise<void> {
    const index = this.orders.findIndex(order => order.identifier === orderId);
    if (index !== -1) {
      this.orders.splice(index, 1);
    }
    return Promise.resolve();
  }

  async findAllByStockId(stockId: string): Promise<Order[]> {
    const orders = this.orders.filter(order => order.stock.identifier === stockId);
    return Promise.resolve(orders);
  }

  async deleteMany(orderIds: string[]): Promise<void> {
    this.orders = this.orders.filter(order => !orderIds.includes(order.identifier!));
    return Promise.resolve();
  }
}
