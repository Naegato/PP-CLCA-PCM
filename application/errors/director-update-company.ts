export class DirectorUpdateCompanyError extends Error {
  public readonly name = 'DirectorUpdateCompanyError';

  constructor(message?: string) {
    super(message);
  }
}