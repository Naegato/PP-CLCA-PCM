export class DirectorGetCompanyError extends Error {
  public readonly name = 'DirectorGetCompanyError';

  constructor(message?: string) {
    super(message);
  }
}