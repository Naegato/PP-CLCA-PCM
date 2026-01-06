export class PasswordDigitError extends Error {
  public readonly name = "PasswordDigitError"

  public constructor(message?: string) {
    super(message);
  }
}