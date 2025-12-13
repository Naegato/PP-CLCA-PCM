export class InvalidIbanError extends Error {
  public readonly name = 'InvalidIbanError';

  constructor(message?: string) {
    super(message);
  }
}