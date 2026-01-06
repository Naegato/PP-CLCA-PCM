export class AccountTypeAlreadyExistError extends Error {
  public readonly name = 'AccountTypeAlreadyExistError';

  public constructor(message?: string) {
    super(message);
  }
}