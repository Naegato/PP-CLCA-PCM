export class DirectorCreateCompanyError extends Error {
  public readonly name = 'DirectorCreateCompanyError';

  constructor(message?: string) {
    super(message);
  }
}