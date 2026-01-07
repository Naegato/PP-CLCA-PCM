export class CompanyDeleteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompanyDeleteError';
  }
}
