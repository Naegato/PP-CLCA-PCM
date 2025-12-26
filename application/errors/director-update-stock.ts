export class DirectorUpdateStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DirectorUpdateStockError';
  }
}
