import { LoanRepository } from '@pp-clca-pcm/application/repositories/loan';
import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { RedisBaseRepository } from './base.js';

export class RedisLoanRepository extends RedisBaseRepository<Loan> implements LoanRepository {
	readonly prefix = 'loan:';

	async save(loan: Loan): Promise<Loan> {
		const key = this.key(loan);

		await this.db.set(
			key,
			JSON.stringify(loan),
			{ NX: true }
		);

		return loan;
	}

	async allByClient(client: User): Promise<Loan[]> {
		return this.fetchFromKey(`${this.prefix}${client.identifier}:*`);
	}

	override key(loan: Loan): string {
		return `${this.prefix}${loan.client.identifier}:${loan.identifier}`;
	}

	protected instanticate(entity: Loan): Loan {
		return Loan.fromPrimitives({
			identifier: entity.identifier,
			client: entity.client,
			amount: entity.amount,
			advisor: entity.advisor,
			transaction: entity.transactions,
		})

	}
}
