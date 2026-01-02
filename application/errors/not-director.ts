export class NotDirector extends Error {
  public readonly name = "NotDirector";

  public constructor(message?: string) {
    super(message);
  }
}
