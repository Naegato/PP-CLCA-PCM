export class TokenSecretNotDefinedError extends Error {
  public readonly name = "TokenSecretNotDefined"

  public constructor(message?: string) {
    super(message);
  }
}
