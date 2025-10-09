export class PasswordLowercaseError extends Error {
  public readonly name = "PasswordLowercaseError"

  public constructor(message?: string) {
    super(message);
  }
}