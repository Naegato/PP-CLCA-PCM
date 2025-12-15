import { randomUUID } from 'node:crypto';

export type StockSymbol = string;

export class Stock {
  constructor(
    public readonly identifier: string | null,
    public readonly symbol: StockSymbol,
    public readonly name: string,
  ) {}

  public static create(symbol: StockSymbol, name: string): Stock {
    return new Stock(randomUUID(), symbol.toUpperCase(), name);
  }

  public update(props: Partial<Stock>): Stock {
    return new Stock(props.identifier ?? this.identifier, props.symbol ?? this.symbol, props.name ?? this.name);
  }
}
