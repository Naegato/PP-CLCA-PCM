export class AdvisorCreateError extends Error {
  public readonly name = 'AdvisorCreateError';

  constructor(public readonly subError: Error | null, message?: string) {
    super(message);
  }
}