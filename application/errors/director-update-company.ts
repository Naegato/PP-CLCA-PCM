export class DirectorUpdateCompanyError extends Error {
  public readonly name = "DirectorUpdateCompanyError";

  public constructor(message?: string) {
    super(message);
  }
}
