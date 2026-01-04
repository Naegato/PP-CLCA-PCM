import { randomUUID } from 'node:crypto';
export class Account {
    identifier;
    owner;
    type;
    emittedTransactions;
    receivedTransactions;
    iban;
    name;
    portfolio;
    constructor(identifier, owner, type, emittedTransactions = [], receivedTransactions = [], iban, name, portfolio) {
        this.identifier = identifier;
        this.owner = owner;
        this.type = type;
        this.emittedTransactions = emittedTransactions;
        this.receivedTransactions = receivedTransactions;
        this.iban = iban;
        this.name = name;
        this.portfolio = portfolio;
    }
    static create(owner, type, iban, name, portfolio) {
        return new Account(randomUUID(), owner, type, [], [], iban, name ?? randomUUID(), portfolio);
    }
    static createFromRaw(identifier, owner, type, iban, name, emittedTransactions = [], receivedTransactions = [], portfolio) {
        return new Account(identifier, owner, type, emittedTransactions, receivedTransactions, iban, name, portfolio);
    }
    update(props) {
        return new Account(this.identifier, this.owner, props.type ?? this.type, props.emittedTransactions ?? this.emittedTransactions, props.receivedTransactions ?? this.receivedTransactions, this.iban, props.name ?? this.name, this.portfolio);
    }
    get balance() {
        const received = this.receivedTransactions?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;
        const emitted = this.emittedTransactions?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;
        return received - emitted;
    }
    calculateDailyInterest() {
        const rate = this.type?.rate ?? 0;
        if (!rate || rate <= 0)
            return 0;
        const dailyRate = rate / 100 / 365;
        const interestRaw = this.balance * dailyRate;
        const interest = Math.round(interestRaw * 100) / 100; //round to cents
        return interest <= 0 ? 0 : interest;
    }
}
//# sourceMappingURL=account.js.map