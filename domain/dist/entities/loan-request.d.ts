import { User } from "./user";
import { LoanRequestAmountError } from "../errors/loan-request-amount";
export declare class LoanRequest {
    readonly identifier: string;
    readonly client: User;
    readonly amount: number;
    readonly approved: boolean;
    readonly advisor: User | null;
    private constructor();
    static create(client: User, amount: number): LoanRequestAmountError | LoanRequest;
    grant(advisor: User): LoanRequest;
    reject(advisor: User): LoanRequest;
    static fromPrimitives(primitives: {
        identifier: string;
        client: User;
        amount: number;
        approved: boolean;
        advisor: User | null;
    }): LoanRequest;
}
//# sourceMappingURL=loan-request.d.ts.map