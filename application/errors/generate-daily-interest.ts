export class GenerateDailyInterestError extends Error {
  public readonly name = 'GenerateDailyInterestError';

  public constructor(message?: string) {
    super(message);
  }
}