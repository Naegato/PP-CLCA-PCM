export class DiscussionNotFoundError extends Error {
  public readonly name = "DiscussionNotFoundError";

  public constructor(message?: string) {
    super(message);
  }
}
