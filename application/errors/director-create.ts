export class DirectorCreateError extends Error {
  public readonly name = 'DirectorCreateError';

  constructor(public readonly subError: Error | null, message?: string) {
    super(message);
  }
}