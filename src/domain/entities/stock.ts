import { randomUUID } from 'node:crypto';
import { Company } from './company.js';

export type StockSymbol = string;

export class Stock {
  private constructor(
    public readonly identifier: string | null,
    public readonly symbol: StockSymbol,
    public readonly name: string,
    public readonly isListed: boolean,
    public readonly createdAt: Date,
    public readonly company: Company,
  ) {}

  public static create(symbol: StockSymbol, name: string, company: Company): Stock {
    return new Stock(randomUUID(), symbol.toUpperCase(), name, true, new Date(), company);
  }

  public update(props: Partial<Omit<Stock, 'identifier' | 'createdAt'>>): Stock {
    return new Stock(
      this.identifier,
      props.symbol ?? this.symbol,
      props.name ?? this.name,
      props.isListed ?? this.isListed,
      this.createdAt,
      props.company ?? this.company
    );
  }

  public toggleListed(): Stock {
    return new Stock(
      this.identifier,
      this.symbol,
      this.name,
      !this.isListed,
      this.createdAt,
      this.company
    );
  }

   public static fromPrimitives(primitives: {
    identifier: string | null,
    symbol: StockSymbol,
    name: string,
    isListed: boolean,
    createdAt: Date,
    company: Company,
  }): Stock {
    return new Stock(
      primitives.identifier,
      primitives.symbol,
      primitives.name,
      primitives.isListed,
      primitives.createdAt,
      primitives.company,
    );
  }
}
