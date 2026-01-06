export class InvalidEmailFormatError extends Error {
  public readonly name = 'InvalidEmailFormatError';

  constructor(message?: string) {
    super(message);
  }
}