export class PasswordLengthError extends Error {
  public readonly name = "PasswordLengthError"

  public constructor(message?: string) {
    super(message);
  }
}