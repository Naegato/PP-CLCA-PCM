import { LoanRequest } from '@pp-clca-pcm/domain/entities/loan-request';
import { RedisBaseRepository } from './base.js';
export class RedisLoanRequestRepository extends RedisBaseRepository {
    prefix = 'loan-request:';
    async save(loan) {
        const key = this.key(loan);
        await this.db.set(key, JSON.stringify(loan), { NX: true });
        return loan;
    }
    async getAllByAdvisor(advisor) {
        const advisorId = advisor.identifier ?? 'null';
        return this.fetchFromKey(`${this.prefix}${advisorId}:*`);
    }
    async get(id) {
        return this.fetchFromKey(`${this.prefix}*:${id}`).then(results => results.length ? results[0] : null);
    }
    key(loan) {
        const advisorId = loan.advisor ? loan.advisor.identifier : 'null';
        return `${this.prefix}${advisorId}:${loan.identifier}`;
    }
    instanticate(entity) {
        return LoanRequest.fromPrimitives({
            identifier: entity.identifier,
            client: entity.client,
            amount: entity.amount,
            approved: entity.approved,
            advisor: entity.advisor,
        });
    }
}
//# sourceMappingURL=request-loan.js.map