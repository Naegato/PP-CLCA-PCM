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
  ) {}

  public static create(stock: Stock, owner: User, side: OrderSide, price: number, quantity: number) {
    return new Order(randomUUID(), stock, owner, side, price, quantity, quantity, new Date());
  }

  public reduceRemainingBy(amount: number): Order {
    const executedQty = Math.max(0, Math.floor(amount));
    const remaining = Math.max(0, this.remainingQuantity - executedQty);
    return new Order(this.identifier, this.stock, this.owner, this.side, this.price, this.quantity, remaining, this.createdAt);
  }

  //update method just in case but prolly shouldn't use it
  public update(props: Partial<Omit<Order, 'identifier' | 'createdAt'>>): Order {
    const newStock = props.stock ?? this.stock;
    const newSide = props.side ?? this.side;
    const newPrice = props.price ?? this.price;
    const newQuantity = props.quantity ?? this.quantity;
    let newRemaining = props.remainingQuantity ?? this.remainingQuantity;

    if (newRemaining < 0) newRemaining = 0;
    if (newRemaining > newQuantity) newRemaining = newQuantity;

    return new Order(this.identifier, newStock, this.owner, newSide, newPrice, newQuantity, newRemaining, this.createdAt);
  }

  //check if order is fully executed (no remaining quantity to buy/sell)
  public get executed(): boolean {
    return this.remainingQuantity === 0;
  }
}
