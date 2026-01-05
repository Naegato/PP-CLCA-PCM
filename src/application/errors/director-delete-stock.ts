export class DirectorDeleteStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DirectorDeleteStockError';
  }
}
