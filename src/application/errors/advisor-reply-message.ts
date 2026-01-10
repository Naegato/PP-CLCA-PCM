export class AdvisorReplyMMessageError extends Error {
  public readonly name = 'AdvisorReplyMessageError';

  public constructor(message?: string) {
    super(message);
  }
}
