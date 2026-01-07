import { randomUUID } from 'node:crypto';
import { Stock } from './stock';
import { Account } from './accounts/account';

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class StockOrder {
  private constructor(
    public readonly identifier: string | null,
    public readonly stock: Stock,
    public readonly account: Account,
    public readonly side: OrderSide,
    public readonly price: number,
    public readonly quantity: number,
    public readonly remainingQuantity: number,
    public readonly createdAt: Date,
  ) {}

  public static create(stock: Stock, account: Account, side: OrderSide, price: number, quantity: number) {
    return new StockOrder(randomUUID(), stock, account, side, price, quantity, quantity, new Date());
  }

  public reduceRemainingBy(amount: number): StockOrder {
    const executedQty = Math.max(0, Math.floor(amount));
    const remaining = Math.max(0, this.remainingQuantity - executedQty);
    return new StockOrder(this.identifier, this.stock, this.account, this.side, this.price, this.quantity, remaining, this.createdAt);
  }

  //update method just in case but prolly shouldn't use it
  public update(props: Partial<Omit<StockOrder, 'identifier' | 'createdAt'>>): StockOrder {
    const newStock = props.stock ?? this.stock;
    const newSide = props.side ?? this.side;
    const newPrice = props.price ?? this.price;
    const newQuantity = props.quantity ?? this.quantity;
    let newRemaining = props.remainingQuantity ?? this.remainingQuantity;

    if (newRemaining < 0) newRemaining = 0;
    if (newRemaining > newQuantity) newRemaining = newQuantity;

    return new StockOrder(this.identifier, newStock, this.account, newSide, newPrice, newQuantity, newRemaining, this.createdAt);
  }

  //check if order is fully executed (no remaining quantity to buy/sell)
  public get executed(): boolean {
    return this.remainingQuantity === 0;
  }

  public static fromPrimitives(primitives: {
    identifier: string | null,
    stock: Stock,
    account: Account,
    side: OrderSide,
    price: number,
    quantity: number,
    remainingQuantity: number,
    createdAt: Date,
  }): StockOrder {
    return new StockOrder(
      primitives.identifier,
      primitives.stock,
      primitives.account,
      primitives.side,
      primitives.price,
      primitives.quantity,
      primitives.remainingQuantity,
      primitives.createdAt,
    );
  }
}
