import { PortfolioItem } from './portfolio-item';
import { Stock } from '../stock';
import { PortfolioError } from '../../errors/portfolio';
import { randomUUID } from 'node:crypto';
import { Account } from '../accounts/account';

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

    try {
      const newItem = currentItem.remove(quantity);
      const newItems = new Map(this.items);

      if (newItem.quantity === 0) {
        newItems.delete(stockId);
      } else {
        newItems.set(stockId, newItem);
      }

      return new Portfolio(this.identifier, this.account, newItems);
    } catch (error) {
      if (error instanceof PortfolioError) {
        return error;
      }
      throw error;
    }
  }

  public static fromPrimitives(primitives: {
    identifier: string | null,
    account: Account,
    items: Array<{ stock: Stock, quantity: number }>,
  }): Portfolio {
    const itemsMap = new Map<string, PortfolioItem>();
    primitives.items.forEach(item => {
      const portfolioItem = PortfolioItem.fromPrimitives({
        identifier: item.stock.identifier,
        stock: item.stock,
        quantity: item.quantity,
      });
      if (item.stock.identifier) {
        itemsMap.set(item.stock.identifier, portfolioItem);
      }
    });

    return new Portfolio(
      primitives.identifier,
      primitives.account,
      itemsMap,
    );
  }
}
