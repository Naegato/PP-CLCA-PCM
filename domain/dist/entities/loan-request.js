import { randomUUID } from "node:crypto";
import { LoanRequestAmountError } from "../errors/loan-request-amount";
export class LoanRequest {
    identifier;
    client;
    amount;
    approved;
    advisor;
    constructor(identifier, client, amount, // in cents ex: 100 = 1€
    approved, advisor) {
        this.identifier = identifier;
        this.client = client;
        this.amount = amount;
        this.approved = approved;
        this.advisor = advisor;
    }
    static create(client, amount) {
        if (amount <= 0) {
            return new LoanRequestAmountError();
        }
        return new LoanRequest(randomUUID(), client, amount, false, null);
    }
    grant(advisor) {
        return new LoanRequest(this.identifier, this.client, this.amount, true, advisor);
    }
    reject(advisor) {
        return new LoanRequest(this.identifier, this.client, this.amount, false, advisor);
    }
    static fromPrimitives(primitives) {
        return new LoanRequest(primitives.identifier, primitives.client, primitives.amount, primitives.approved, primitives.advisor);
    }
}
//# sourceMappingURL=loan-request.js.map