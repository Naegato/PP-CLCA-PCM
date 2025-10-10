export class UserUpdateError extends Error {
  public readonly name = "UserUpdateError";

  public constructor(message?: string) {
    super(message);
  }
}