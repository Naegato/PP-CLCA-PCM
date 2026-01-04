import { PasswordLengthError } from '@pp-clca-pcm/domain/errors/password-length';
import { PasswordUppercaseError } from '@pp-clca-pcm/domain/errors/password-uppercase';
import { PasswordLowercaseError } from '@pp-clca-pcm/domain/errors/password-lowercase';
import { PasswordSpecialError } from '@pp-clca-pcm/domain/errors/password-special';
import { PasswordDigitError } from '@pp-clca-pcm/domain/errors/password-digit';
export declare class Password {
    readonly value: string;
    private constructor();
    static create(value: string): PasswordLengthError | PasswordUppercaseError | PasswordLowercaseError | PasswordSpecialError | PasswordDigitError | Password;
    toJSON(): string;
}
//# sourceMappingURL=password.d.ts.map