import { randomUUID } from "node:crypto";
export class Company {
    identifier;
    name;
    constructor(identifier, name) {
        this.identifier = identifier;
        this.name = name;
    }
    static create(name) {
        return new Company(randomUUID(), name);
    }
    update(props) {
        return new Company(this.identifier, props.name ?? this.name);
    }
}
//# sourceMappingURL=company.js.map