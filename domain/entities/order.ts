import { randomUUID } from 'node:crypto';
import { Stock } from './stock';
import { User } from './user';

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class Order {
  constructor(
    public readonly identifier: string | null,
    public readonly stock: Stock,
    public readonly owner: User,
    public readonly side: OrderSide,
    public readonly price: number,
    public readonly quantity: number,
    public readonly remainingQuantity: number,
    public readonly createdAt: Date,
    public readonly executed: boolean = false,
  ) {}

  public static create(stock: Stock, owner: User, side: OrderSide, price: number, quantity: number) {
    return new Order(randomUUID(), stock, owner, side, price, quantity, quantity, new Date(), false);
  }

  public withExecutedQuantity(executedQty: number): Order {
    const remaining = Math.max(0, this.remainingQuantity - executedQty);
    const executed = remaining === 0;
    return new Order(this.identifier, this.stock, this.owner, this.side, this.price, this.quantity, remaining, this.createdAt, executed);
  }
}
