export class SimulatedLoanError extends Error {
  public readonly name = 'SimulatedLoanError';

  public constructor(message?: string) {
    super(message);
  }
}
