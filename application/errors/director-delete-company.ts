export class DirectorDeleteCompanyError extends Error {
  public readonly name = "DirectorDeleteCompanyError";

  public constructor(message?: string) {
    super(message);
  }
}
