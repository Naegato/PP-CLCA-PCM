import { InvalidEmailFormatError } from '@pp-clca-pcm/domain/errors/invalid-email-format';
export declare class Email {
    readonly value: string;
    private constructor();
    static create(value: string): Email | InvalidEmailFormatError;
    toJSON(): string;
}
//# sourceMappingURL=email.d.ts.map