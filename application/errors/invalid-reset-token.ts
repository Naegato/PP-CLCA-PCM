export class InvalidResetTokenError extends Error {
  public readonly name = 'InvalidResetTokenError';

  constructor(message?: string) {
    super(message);
  }
}
