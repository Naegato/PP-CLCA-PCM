import { Account } from './accounts/account';

export class Transaction {
  public constructor (
    public readonly identifier: string | null,
    public readonly recipient: Account,
    public readonly amount: number,
    public readonly date: Date,
    public readonly sender?: Account,
    public readonly description?: string,
  ) { }
}