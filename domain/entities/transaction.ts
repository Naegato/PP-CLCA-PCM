import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { randomUUID } from "node:crypto";
import { Loan } from '@pp-clca-pcm/domain/entities/loan';

export class Transaction {
	private constructor(
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

	public static fromPrimitives(primitives: {
		identifier: string,
		identified: Account | Loan,
		amount: number,
		date: Date,
		description?: string,
	}): Transaction {
		return new Transaction(
			primitives.identifier,
			primitives.identified,
			primitives.amount,
			primitives.date,
			primitives.description,
		);
	}
}
