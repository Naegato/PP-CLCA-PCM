export class UserNotFoundByEmailError extends Error {
  public readonly name = 'UserNotFoundByEmailError';

  constructor(message?: string) {
    super(message);
  }
}