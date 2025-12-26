export class ClientGetStockOrdersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientGetStockOrdersError';
  }
}
