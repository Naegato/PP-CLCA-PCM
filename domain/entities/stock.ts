import { randomUUID } from 'node:crypto';

export type StockSymbol = string;

export class Stock {
  constructor(
    public readonly identifier: string | null,
    public readonly symbol: StockSymbol,
    public readonly name: string,
    public readonly isListed: boolean,
    public readonly createdAt: Date,
  ) {}

  public static create(symbol: StockSymbol, name: string): Stock {
    return new Stock(randomUUID(), symbol.toUpperCase(), name, true, new Date());
  }

  public update(props: Partial<Omit<Stock, 'identifier' | 'createdAt'>>): Stock {
    return new Stock(
      this.identifier,
      props.symbol ?? this.symbol,
      props.name ?? this.name,
      props.isListed ?? this.isListed,
      this.createdAt
    );
  }

  public toggleListed(): Stock {
    return new Stock(
      this.identifier,
      this.symbol,
      this.name,
      !this.isListed,
      this.createdAt
    );
  }
}
