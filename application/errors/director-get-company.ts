export class DirectorGetCompanyError extends Error {
  public readonly name = "DirectorGetCompanyError";

  public constructor(message?: string) {
    super(message);
  }
}
