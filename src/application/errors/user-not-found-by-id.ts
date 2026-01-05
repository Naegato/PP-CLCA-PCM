export class UserNotFoundByIdError extends Error {
  public readonly name = 'UserNotFoundByIdError';

  constructor(message?: string) {
    super(message);
  }
}
