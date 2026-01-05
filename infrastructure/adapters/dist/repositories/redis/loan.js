import { Loan } from '@pp-clca-pcm/domain/entities/loan';
import { RedisBaseRepository } from './base.js';
export class RedisLoanRepository extends RedisBaseRepository {
    prefix = 'loan:';
    async save(loan) {
        const key = this.key(loan);
        await this.db.set(key, JSON.stringify(loan), { NX: true });
        return loan;
    }
    async allByClient(client) {
        return this.fetchFromKey(`${this.prefix}${client.identifier}:*`);
    }
    key(loan) {
        return `${this.prefix}${loan.client.identifier}:${loan.identifier}`;
    }
    instanticate(entity) {
        return Loan.fromPrimitives({
            identifier: entity.identifier,
            client: entity.client,
            amount: entity.amount,
            advisor: entity.advisor,
            transaction: entity.transactions,
        });
    }
}
//# sourceMappingURL=loan.js.map