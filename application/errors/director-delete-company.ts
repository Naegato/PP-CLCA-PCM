export class DirectorDeleteCompanyError extends Error {
  public readonly name = 'DirectorDeleteCompanyError';

  constructor(message?: string) {
    super(message);
  }
}