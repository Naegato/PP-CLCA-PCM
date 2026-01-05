export class DirectorCreateCompanyError extends Error {
  public readonly name = "DirectorCreateCompanyError";

  public constructor(message?: string) {
    super(message);
  }
}
