export class ClientGetPortfolioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientGetPortfolioError';
  }
}
