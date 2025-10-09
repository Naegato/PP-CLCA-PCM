export class ClientCreateError extends Error {
  public readonly name = 'ClientCreateError';

  constructor(public readonly subError: Error | null, message?: string) {
    super(message);
  }
}