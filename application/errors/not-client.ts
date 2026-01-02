export class NotClient extends Error {
  public readonly name = "NotClient";

  public constructor(message?: string) {
    super(message);
  }
}
