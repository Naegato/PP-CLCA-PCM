import { User } from "./user.js";
import { Transaction } from "./transaction.js";
import { randomUUID } from "node:crypto";

export class Loan {
  private constructor(
    public readonly identifier: string,
    public readonly client: User,
    public readonly amount: number, // in cents ex: 100 = 1€
    public readonly advisor: User,
    public readonly transactions: Transaction[]
  ) { }

  public static create(
    client: User,
    amount: number,
    advisor: User,
  ) {
    return new Loan(randomUUID(), client, amount, advisor, []);
  }

  public getTotalPaidAmount(): number {
	return this.transactions
	  .filter(tx => tx.amount > 0)
	  .reduce((sum, tx) => sum + tx.amount, 0);
  }

  public isFullyPaid(): boolean {
	return this.getTotalPaidAmount() >= this.amount;
  }

  public static fromPrimitives(data: any) {
	return new Loan(
	  data.identifier,
	  data.client,
	  data.amount,
	  data.advisor,
	  data.transactions,
	);
  }
}
