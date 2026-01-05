export class ClientCreatePortfolioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientCreatePortfolioError';
  }
}
