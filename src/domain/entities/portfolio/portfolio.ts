import { PortfolioItem } from './portfolio-item.js';
import { Stock } from '../stock.js';
import { PortfolioError } from '../../errors/portfolio.js';
import { randomUUID } from 'node:crypto';
import { Account } from '../accounts/account.js';

export class Portfolio {
  private readonly items: Map<string, PortfolioItem>;

  private constructor(
    public readonly identifier: string | null,
    public readonly account: Account,
    items?: Map<string, PortfolioItem>
  ) {
    this.items = items ? new Map(items) : new Map();
  }

  public static create(account: Account, items?: Map<string, PortfolioItem>): Portfolio {
    return new Portfolio(randomUUID(), account, items);
  }

  public getOwnedQuantity(stockId: string): number {
    return this.items.get(stockId)?.quantity ?? 0;
  }

  public addStock(stock: Stock, quantity: number): Portfolio | PortfolioError {

    if (!stock.identifier) {
      return new PortfolioError("Stock identifier is required.");
    }
    if (quantity <= 0) {
      return new PortfolioError("Quantity must be positive.");
    }

    const currentItem = this.items.get(stock.identifier);

    const newItem = currentItem ? currentItem.add(quantity) : PortfolioItem.create(stock, quantity);
    const newItems = new Map(this.items).set(stock.identifier, newItem);

    return new Portfolio(this.identifier, this.account, newItems);
  }

  public removeStock(stock: Stock, quantity: number): Portfolio | PortfolioError {

    if (!stock.identifier) {
      return new PortfolioError("Stock identifier is required.");
    }
    if (quantity <= 0) {
      return new PortfolioError("Quantity must be positive.");
    }

    const stockId = stock.identifier;
    const currentItem = this.items.get(stockId);

    if (!currentItem) {
      return new PortfolioError(`Cannot remove ${quantity} of stock ${stockId}: not found in portfolio.`);
    }

    const newItem = currentItem.remove(quantity);
    const newItems = new Map(this.items);

    if (newItem instanceof Error) {
      return newItem;
    }

    if (newItem.quantity === 0) {
      newItems.delete(stockId);
    } else {
      newItems.set(stockId, newItem);
    }

    return new Portfolio(this.identifier, this.account, newItems);
  }

  public static createFromRaw(
    identifier: string,
    account: Account,
    items: Map<string, PortfolioItem>
  ) {
    return new Portfolio(randomUUID(), account, items);
  }

  public static fromPrimitives(primitives: {
    identifier: string,
    account: Account,
    items: { stock: Stock, quantity: number }[],
  }): Portfolio {
    const itemsMap = new Map<string, PortfolioItem>();
    for (const item of primitives.items) {
      if (!item.stock.identifier) {
        throw new PortfolioError("Stock identifier is required.");
      }
      if (item.quantity <= 0) {
        throw new PortfolioError("Quantity must be positive.");
      }
      itemsMap.set(item.stock.identifier, PortfolioItem.create(item.stock, item.quantity));
    }
    return new Portfolio(
      primitives.identifier,
      primitives.account,
      itemsMap
    );
  }

  public toPrimitives(): {
    identifier: string | null;
    account: Account;
    items: { stock: Stock, quantity: number }[];
  } {
    const itemsArray: { stock: Stock, quantity: number }[] = [];
    for (const item of this.items.values()) {
        itemsArray.push({
            stock: item.stock,
            quantity: item.quantity,
        });
    }
    return {
        identifier: this.identifier,
        account: this.account,
        items: itemsArray,
    };
  }
}
