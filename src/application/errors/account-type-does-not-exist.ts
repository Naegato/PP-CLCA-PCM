export class AccountTypeDoesNotExistError extends Error {
  public readonly name = 'AccountTypeDoesNotExistError';

  public constructor(message?: string) {
    super(message);
  }
}
