export class PasswordSpecialError extends Error {
  public readonly name = "PasswordSpecialError"

  public constructor(message?: string) {
    super(message);
  }
}