export class DirectorGetCompanyByIdError extends Error {
  public readonly name = 'DirectorGetCompanyByIdError';

  constructor(message?: string) {
    super(message);
  }
}