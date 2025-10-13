import { Account } from './accounts/account';
import { randomUUID } from "node:crypto";
import { Loan } from './loan';

export class Transaction {
  private constructor (
    public readonly identifier: string | null,
    public readonly identified: Account | Loan,
    public readonly amount: number,
    public readonly date: Date,
    public readonly description?: string,
  ) { }

  public static create(
    identified: Account | Loan,
    amount: number,
    description?: string,
  ) {
    return new Transaction(randomUUID(), identified, amount, new Date(), description);
  }
}