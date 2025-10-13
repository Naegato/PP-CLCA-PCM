import { User } from "./user";
import { randomUUID } from "node:crypto";
import { LoanRequestAmountError } from "../errors/loan-request-amount";

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
}