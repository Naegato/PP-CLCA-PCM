import { Stock } from '../stock';
import { PortfolioError } from '../../errors/portfolio';
import { randomUUID } from 'node:crypto';

export class PortfolioItem {
  constructor(
    public readonly identifier: string | null,
    public readonly stock: Stock,
    public readonly quantity: number,
  ) {}

  public static create(stock: Stock, quantity: number): PortfolioItem {
    return new PortfolioItem(randomUUID(), stock, quantity);
  }

  public add(quantity: number): PortfolioItem {
    return new PortfolioItem(this.identifier, this.stock, this.quantity + quantity);
  }

  public remove(quantity: number): PortfolioItem {
    if (this.quantity < quantity) {
      throw new PortfolioError('Cannot remove more stock than owned');
    }
    return new PortfolioItem(this.identifier, this.stock, this.quantity - quantity);
  }
}
