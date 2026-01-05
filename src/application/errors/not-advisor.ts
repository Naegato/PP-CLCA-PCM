export class NotAdvisor extends Error {
  public readonly name = "NotAdvisor"

  public constructor(message?: string) {
    super(message);
  }
}
