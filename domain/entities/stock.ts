import { randomUUID } from 'node:crypto';

export type StockSymbol = string;

export class Stock {
  constructor(
    public readonly identifier: string | null,
    public readonly symbol: StockSymbol,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}

  public static create(symbol: StockSymbol, name: string): Stock {
    return new Stock(randomUUID(), symbol.toUpperCase(), name, new Date());
  }

  public update(props: Partial<Omit<Stock, 'identifier' | 'createdAt'>>): Stock {
    return new Stock(this.identifier, props.symbol ?? this.symbol, props.name ?? this.name, this.createdAt);
  }
}
