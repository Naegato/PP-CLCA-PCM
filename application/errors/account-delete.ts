export class AccountDeleteError extends Error {
  public readonly name = "AccountDeleteError";

  public constructor(message?: string) {
    super(message);
  }
}