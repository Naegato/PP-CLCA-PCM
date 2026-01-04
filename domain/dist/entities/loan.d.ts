import { User } from "@pp-clca-pcm/domain/entities/user";
import { Transaction } from "@pp-clca-pcm/domain/entities/transaction";
export declare class Loan {
    readonly identifier: string;
    readonly client: User;
    readonly amount: number;
    readonly advisor: User;
    readonly transactions: Transaction[];
    private constructor();
    static create(client: User, amount: number, advisor: User): Loan;
    getTotalPaidAmount(): number;
    isFullyPaid(): boolean;
    static fromPrimitives(data: any): Loan;
}
//# sourceMappingURL=loan.d.ts.map