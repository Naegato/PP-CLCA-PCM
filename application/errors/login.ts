export class LoginError extends Error {
  public readonly name = "LoginError"

  public constructor(message?: string) {
    super(message);
  }
}