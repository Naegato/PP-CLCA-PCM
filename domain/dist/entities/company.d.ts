export declare class Company {
    readonly identifier: string;
    readonly name: string;
    private constructor();
    static create(name: string): Company;
    update(props: Partial<Omit<Company, 'identifier'>>): Company;
}
//# sourceMappingURL=company.d.ts.map