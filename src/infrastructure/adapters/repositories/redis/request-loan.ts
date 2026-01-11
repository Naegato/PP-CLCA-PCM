import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
import { LoanRequestRepository } from '@pp-clca-pcm/application/repositories/request-loan';
import { RedisBaseRepository } from './base.js';
import { RedisClientType } from "redis";
import { User } from '@pp-clca-pcm/domain/entities/user';

export class RedisLoanRequestRepository extends RedisBaseRepository<LoanRequest> implements LoanRequestRepository {
	readonly prefix = 'loan-request:';

	public constructor(
		redisClient: RedisClientType,
	) {
		super(redisClient);
	}

  async save(loan: LoanRequest): Promise<LoanRequest> {
    const key = this.key(loan);

		await this.redisClient.set(
			key,
			JSON.stringify(loan),
			{ NX: true }
		);

    return loan;
  }

	async getAllByAdvisor(advisor: User): Promise<LoanRequest[]> {
		const advisorId = advisor.identifier ? advisor.identifier : 'null';
		return this.fetchFromKey(`${this.prefix}${advisorId}:*`);
	}

  async get(id: string): Promise<LoanRequest | null> {
    return this.fetchFromKey(`${this.prefix}*:${id}`).then(results => results.length ? results[0] : null);
  }

  override key(loan: LoanRequest): string {
    const advisorId = loan.advisor ? loan.advisor.identifier : 'null';

    return `${this.prefix}${advisorId}:${loan.identifier}`;
  }

  protected instanticate(entity: LoanRequest): LoanRequest {
    return LoanRequest.fromPrimitives({
      identifier: entity.identifier,
      client: entity.client,
      amount: entity.amount,
      approved: entity.approved,
      advisor: entity.advisor,
    });
  }
}
