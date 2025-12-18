export class ClientCancelStockOrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientCancelStockOrderError';
  }
}
