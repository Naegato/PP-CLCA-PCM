export class EmailAlreadyExistError extends Error {
  public readonly name = 'EmailAlreadyExistError';

  constructor(message?: string) {
    super(message);
  }
}