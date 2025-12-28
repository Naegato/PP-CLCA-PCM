export class DirectorGetCompanyByIdError extends Error {
  public readonly name = "DirectorGetCompanyByIdError";

  public constructor(message?: string) {
    super(message);
  }
}
