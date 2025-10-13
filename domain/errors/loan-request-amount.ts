export class LoanRequestAmountError extends Error {
  public readonly name = 'LoanRequestAmountError';

  public constructor(message?: string) {
    super(message);
  }
}