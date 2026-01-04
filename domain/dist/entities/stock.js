import { randomUUID } from 'node:crypto';
export class Stock {
    identifier;
    symbol;
    name;
    isListed;
    createdAt;
    company;
    constructor(identifier, symbol, name, isListed, createdAt, company) {
        this.identifier = identifier;
        this.symbol = symbol;
        this.name = name;
        this.isListed = isListed;
        this.createdAt = createdAt;
        this.company = company;
    }
    static create(symbol, name, company) {
        return new Stock(randomUUID(), symbol.toUpperCase(), name, true, new Date(), company);
    }
    update(props) {
        return new Stock(this.identifier, props.symbol ?? this.symbol, props.name ?? this.name, props.isListed ?? this.isListed, this.createdAt, props.company ?? this.company);
    }
    toggleListed() {
        return new Stock(this.identifier, this.symbol, this.name, !this.isListed, this.createdAt, this.company);
    }
}
//# sourceMappingURL=stock.js.map