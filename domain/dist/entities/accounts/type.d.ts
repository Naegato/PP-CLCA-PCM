export declare enum AccountTypeNameEnum {
    DEFAULT = "DEFAULT",
    SAVINGS = "SAVINGS"
}
export type AccountTypeName = keyof typeof AccountTypeNameEnum | string;
export declare class AccountType {
    readonly identifier: string | null;
    readonly name: AccountTypeName;
    readonly rate: number;
    readonly limitByClient?: number | null | undefined;
    readonly description?: string | null | undefined;
    private constructor();
    static create(name: string, rate: number, description?: string | null): AccountType;
    update(props: Partial<AccountType>): AccountType;
    static createFromRaw(identifier: string, name: AccountTypeName, rate: number, limitByClient?: number | null, description?: string | null): AccountType;
}
//# sourceMappingURL=type.d.ts.map