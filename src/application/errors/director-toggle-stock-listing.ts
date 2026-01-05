export class DirectorToggleStockListingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DirectorToggleStockListingError';
  }
}
