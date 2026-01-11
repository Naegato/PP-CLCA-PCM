import { RedisBaseRepository } from './base.js';
import { RedisClientType } from 'redis';
import { LoanRepository } from '@pp-clca-pcm/application';
import { Loan, User } from '@pp-clca-pcm/domain';

export class RedisLoanRepository extends RedisBaseRepository<Loan> implements LoanRepository {
	readonly prefix = 'loan:';

	public constructor(
		redisClient: RedisClientType,
	) {
		super(redisClient);
	}

  async save(loan: Loan): Promise<Loan> {
    const key = this.key(loan);

		await this.redisClient.set(
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
			identifier: entity.identifier ?? "",
			client: entity.client,
			amount: entity.amount,
			advisor: entity.advisor,
			transaction: entity.transactions,
		})
	}
}
