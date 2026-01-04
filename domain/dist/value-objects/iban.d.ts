import { InvalidIbanError } from "@pp-clca-pcm/domain/errors/invalid-iban-format";
export declare class Iban {
    readonly value: string;
    private constructor();
    static create(value: string): Iban | InvalidIbanError;
    static generate(bankCode: string, branchCode: string, accountNumber: string): Iban | InvalidIbanError;
    static getAccountNumber(iban: string): string | InvalidIbanError;
}
//# sourceMappingURL=iban.d.ts.map