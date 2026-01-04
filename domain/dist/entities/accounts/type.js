export var AccountTypeNameEnum;
(function (AccountTypeNameEnum) {
    AccountTypeNameEnum["DEFAULT"] = "DEFAULT";
    AccountTypeNameEnum["SAVINGS"] = "SAVINGS";
})(AccountTypeNameEnum || (AccountTypeNameEnum = {}));
export class AccountType {
    identifier;
    name;
    rate;
    limitByClient;
    description;
    constructor(identifier, name, rate, limitByClient, description) {
        this.identifier = identifier;
        this.name = name;
        this.rate = rate;
        this.limitByClient = limitByClient;
        this.description = description;
    }
    static create(name, rate, description) {
        return new AccountType(null, name, rate, null, description ?? null);
    }
    update(props) {
        return new AccountType(props.identifier ?? this.identifier, props.name ?? this.name, props.rate ?? this.rate, props.limitByClient ?? this.limitByClient, props.description ?? this.description);
    }
    static createFromRaw(identifier, name, rate, limitByClient, description) {
        return new AccountType(identifier, name, rate, limitByClient, description);
    }
}
//# sourceMappingURL=type.js.map