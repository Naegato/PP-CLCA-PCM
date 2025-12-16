import { RedisClientType } from 'redis';
import { randomUUID } from 'crypto';
import { LoanRepository } from '@pp-clca-pcm/application/repositories/loan';
import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { User } from '@pp-clca-pcm/domain/entities/user';

export class RedisLoanRepository implements LoanRepository {
	readonly PREFIX = 'loan:';

	constructor(private readonly db: RedisClientType) { }

	async save(loan: Loan): Promise<Loan> {
		const key = this.key(loan);

		await this.db.set(
			key,
			JSON.stringify(loan),
			{ NX: true }
		);

		return loan;
	}

	async all(): Promise<Loan[]> {
		return this.fetchFromKey(`${this.PREFIX}*`);
	}

	async allByClient(client: User): Promise<Loan[]> {
		return this.fetchFromKey(`${this.PREFIX}${client.identifier}:*`);
	}

	private async fetchFromKey(keyToSearch: string): Promise<Loan[]> {
		const result: Loan[] = [];

		for await (const key of this.db.scanIterator({ MATCH: keyToSearch })) {
			await Promise.all(key.map(async k => {
				const value = await this.db.get(k);
				if (!value) return;

				const data = JSON.parse(value);
				result.push(
					Loan.fromPrimitives({
						identifier: data.identifier,
						client: data.client,
						amount: data.amount,
						advisor: data.advisor,
						transaction: data.transactions,
					})
				);
			}))
		}

		return result;
	}

	private key(loan: Loan): string {
		return `${this.PREFIX}${loan.client.identifier}:${loan.identifier}`;
	}
}
