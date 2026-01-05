export class AccountUpdateError extends Error {
  public readonly name = "AccountUpdateError";

  public constructor(message?: string) {
    super(message);
  }
}