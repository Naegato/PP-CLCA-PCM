export class AccountCreateError extends Error {
  public readonly name = "AccountCreateError";

  public constructor(message?: string) {
    super(message);
  }
}