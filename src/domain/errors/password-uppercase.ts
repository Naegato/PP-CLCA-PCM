export class PasswordUppercaseError extends Error {
  public readonly name = "PasswordUppercaseError"

  public constructor(message?: string) {
    super(message);
  }
}