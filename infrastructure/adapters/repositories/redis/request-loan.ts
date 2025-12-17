import { RedisClientType } from 'redis';
import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
import { LoanRequestRepository } from '@pp-clca-pcm/application/repositories/request-loan';

export class RedisLoanRequestRepository implements LoanRequestRepository {
	readonly PREFIX = 'loan-request:';

	constructor(private readonly db: RedisClientType) { }

	async save(loan: LoanRequest): Promise<LoanRequest> {
		const key = this.key(loan);

		await this.db.set(
			key,
			JSON.stringify(loan),
			{ NX: true }
		);

		return loan;
	}

	async all(): Promise<LoanRequest[]> {
		return this.fetchFromKey(`${this.PREFIX}*`);
	}

	async getAllByAdvisor(advisorId: string): Promise<LoanRequest[]> {
		return this.fetchFromKey(`${this.PREFIX}${advisorId}:*`);
	}

	async get(id: string): Promise<LoanRequest | null> {
		return this.fetchFromKey(`${this.PREFIX}*:${id}`).then(results => results.length ? results[0] : null);
	}

	private async fetchFromKey(keyToSearch: string): Promise<LoanRequest[]> {
		const result: LoanRequest[] = [];

		for await (const key of this.db.scanIterator({ MATCH: keyToSearch })) {
			await Promise.all(key.map(async k => {
				const value = await this.db.get(k);
				if (!value) return;

				const data = JSON.parse(value);
				result.push(
					LoanRequest.fromPrimitives({
						identifier: data.identifier,
						client: data.client,
						amount: data.amount,
						approved: data.approved,
						advisor: data.advisor,
					})
				);
			}))
		}

		return result;
	}

	private key(loan: LoanRequest): string {
		const advisorId = loan.advisor ? loan.advisor.identifier : 'null';

		return `${this.PREFIX}${advisorId}:${loan.identifier}`;
	}
}
