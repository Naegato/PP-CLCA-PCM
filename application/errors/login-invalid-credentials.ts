export class LoginInvalidCredentialsError extends Error {
  public readonly name = 'LoginInvalidCredentialsError';

  constructor(message?: string) {
    super(message);
  }
}