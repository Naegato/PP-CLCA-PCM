export class MatchStockOrderError extends Error {
  public readonly name = 'MatchStockOrderError';

  public constructor(message?: string) {
    super(message);
  }
}
