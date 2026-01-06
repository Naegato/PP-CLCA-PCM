export class ClientGetStockWithPriceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientGetStockWithPriceError';
  }
}
