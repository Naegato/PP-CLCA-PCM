import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
import { StockOrderRepository } from '@pp-clca-pcm/application/repositories/stockOrder';

export class InMemoryStockOrderRepository implements StockOrderRepository {
  public orders: StockOrder[] = [];

  save(order: StockOrder): Promise<StockOrder> {
    const existingOrderIndex = this.orders.findIndex(existingOrder => existingOrder.identifier === order.identifier);
    if (existingOrderIndex !== -1) {
      this.orders[existingOrderIndex] = order;
    } else {
      this.orders.push(order);
    }
    return Promise.resolve(order);
  }

  allByStock(stockId: string): Promise<StockOrder[]> {
    return Promise.resolve(this.orders.filter(order => order.stock.identifier === stockId));
  }

  async findOpenBuyOrders(stockId?: string, price?: number): Promise<StockOrder[]> {
    return this.orders.filter(order =>
      order.side === OrderSide.BUY &&
      order.remainingQuantity > 0 &&
      (stockId === undefined || order.stock.identifier === stockId) &&
      (price === undefined || order.price <= price)
    );
  }

  async findOpenSellOrders(stockId?: string, price?: number): Promise<StockOrder[]> {
    return this.orders.filter(order =>
      order.side === OrderSide.SELL &&
      order.remainingQuantity > 0 &&
      (stockId === undefined || order.stock.identifier === stockId) &&
      (price === undefined || order.price >= price)
    );
  }

  getCommittedSellQuantity(accountId: string, stockId: string): Promise<number> {
    const sellOrders = this.orders.filter(order =>
      order.account.identifier === accountId &&
      order.stock.identifier === stockId &&
      order.side === OrderSide.SELL &&
      order.remainingQuantity > 0
    );
    const committedQuantity = sellOrders.reduce((total, order) => total + order.remainingQuantity, 0);
    return Promise.resolve(committedQuantity);
  }

  async findById(orderId: string): Promise<StockOrder | null> {
    const order = this.orders.find(order => order.identifier === orderId);
    return Promise.resolve(order || null);
  }

  async findAllByOwnerId(ownerId: string): Promise<StockOrder[]> {
    const orders = this.orders.filter(order => order.account.owner.identifier === ownerId);
    return Promise.resolve(orders);
  }

  async delete(orderId: string): Promise<void> {
    const index = this.orders.findIndex(order => order.identifier === orderId);
    if (index !== -1) {
      this.orders.splice(index, 1);
    }
    return Promise.resolve();
  }

  async findAllByStockId(stockId: string): Promise<StockOrder[]> {
    const orders = this.orders.filter(order => order.stock.identifier === stockId);
    return Promise.resolve(orders);
  }

  async deleteMany(orderIds: string[]): Promise<void> {
    this.orders = this.orders.filter(order => !orderIds.includes(order.identifier!));
    return Promise.resolve();
  }
}
