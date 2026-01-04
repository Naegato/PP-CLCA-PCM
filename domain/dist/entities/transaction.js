import { randomUUID } from "node:crypto";
export class Transaction {
    identifier;
    identified;
    amount;
    date;
    description;
    constructor(identifier, identified, amount, date, description) {
        this.identifier = identifier;
        this.identified = identified;
        this.amount = amount;
        this.date = date;
        this.description = description;
    }
    static create(identified, amount, description) {
        return new Transaction(randomUUID(), identified, amount, new Date(), description);
    }
    static fromPrimitives(primitives) {
        return new Transaction(primitives.identifier, primitives.identified, primitives.amount, primitives.date, primitives.description);
    }
}
//# sourceMappingURL=transaction.js.map