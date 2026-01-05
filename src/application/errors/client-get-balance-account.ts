export class ClientGetBalanceAccountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientGetBalanceAccountError';
  }
}
