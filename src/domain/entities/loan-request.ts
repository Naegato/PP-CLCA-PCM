import { User } from "./user.js";
import { randomUUID } from "node:crypto";
import { LoanRequestAmountError } from "../errors/loan-request-amount.js";

export class LoanRequest {
  private constructor(
    public readonly identifier: string,
    public readonly client: User,
    public readonly amount: number, // in cents ex: 100 = 1€
    public readonly approved: boolean,
    public readonly advisor: User | null,
  ) { }

  public static create(
    client: User,
    amount: number,
  ) {
    if (amount <= 0) {
      return new LoanRequestAmountError();
    }


    return new LoanRequest(randomUUID(), client, amount, false, null)
  }

  grant(advisor: User): LoanRequest {
	return new LoanRequest(
	  this.identifier,
	  this.client,
	  this.amount,
	  true,
	  advisor,
	);
  }

  reject(advisor: User): LoanRequest {
	return new LoanRequest(
	  this.identifier,
	  this.client,
	  this.amount,
	  false,
	  advisor,
	)
  }

  public static fromPrimitives(primitives: {
	identifier: string,
	client: User,
	amount: number,
	approved: boolean,
	advisor: User | null,
  }): LoanRequest {
	return new LoanRequest(
	  primitives.identifier,
	  primitives.client,
	  primitives.amount,
	  primitives.approved,
	  primitives.advisor,
	);
  }
}
