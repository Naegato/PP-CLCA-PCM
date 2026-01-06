export class TransactionError extends Error {
  public readonly name = 'TransactionError';

  public constructor(message?: string) {
    super(message);
  }
}