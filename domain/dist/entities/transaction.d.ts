import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { Loan } from '@pp-clca-pcm/domain/entities/loan';
export declare class Transaction {
    readonly identifier: string | null;
    readonly identified: Account | Loan;
    readonly amount: number;
    readonly date: Date;
    readonly description?: string | undefined;
    private constructor();
    static create(identified: Account | Loan, amount: number, description?: string): Transaction;
    static fromPrimitives(primitives: {
        identifier: string;
        identified: Account | Loan;
        amount: number;
        date: Date;
        description?: string;
    }): Transaction;
}
//# sourceMappingURL=transaction.d.ts.map