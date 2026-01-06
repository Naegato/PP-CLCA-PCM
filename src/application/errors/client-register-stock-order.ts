export class ClientRegisterStockOrderError extends Error {
  public readonly name = 'ClientRegisterStockOrderError';

  public constructor(message?: string) {
    super(message);
  }
}
