export class PortfolioError extends Error {
  public readonly name = 'PortfolioError';
  public constructor(message?: string) { super(message); }
}
