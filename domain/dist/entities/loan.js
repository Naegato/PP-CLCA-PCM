import { randomUUID } from "node:crypto";
export class Loan {
    identifier;
    client;
    amount;
    advisor;
    transactions;
    constructor(identifier, client, amount, // in cents ex: 100 = 1€
    advisor, transactions) {
        this.identifier = identifier;
        this.client = client;
        this.amount = amount;
        this.advisor = advisor;
        this.transactions = transactions;
    }
    static create(client, amount, advisor) {
        return new Loan(randomUUID(), client, amount, advisor, []);
    }
    getTotalPaidAmount() {
        return this.transactions
            .filter(tx => tx.amount > 0)
            .reduce((sum, tx) => sum + tx.amount, 0);
    }
    isFullyPaid() {
        return this.getTotalPaidAmount() >= this.amount;
    }
    static fromPrimitives(data) {
        return new Loan(data.identifier, data.client, data.amount, data.advisor, data.transactions);
    }
}
//# sourceMappingURL=loan.js.map