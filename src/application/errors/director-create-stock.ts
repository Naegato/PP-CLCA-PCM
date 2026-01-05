export class DirectorCreateStockError extends Error {
  public readonly name = 'DirectorCreateStockError';

  public constructor(message?: string) {
    super(message);
  }
}
