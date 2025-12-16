export class MatchOrderError extends Error {
  public readonly name = 'MatchOrderError';

  public constructor(message?: string) {
    super(message);
  }
}
