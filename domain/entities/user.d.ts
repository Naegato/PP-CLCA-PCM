import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';
import { Password } from '@pp-clca-pcm/domain/value-objects/password';
import { Email } from '@pp-clca-pcm/domain/value-objects/email';
export declare class User {
    readonly identifier: string | null;
    readonly firstname: string;
    readonly lastname: string;
    readonly email: Email;
    readonly password: Password;
    readonly clientProps?: ClientProps | undefined;
    readonly advisorProps?: AdvisorProps | undefined;
    readonly directorProps?: DirectorProps | undefined;
    private constructor();
    static create(firstname: string, lastname: string, email: string, password: string): User | import("../dist/errors/invalid-email-format").InvalidEmailFormatError | import("../dist/errors/password-length").PasswordLengthError | import("../dist/errors/password-uppercase").PasswordUppercaseError | import("../dist/errors/password-lowercase").PasswordLowercaseError | import("../dist/errors/password-special").PasswordSpecialError | import("../dist/errors/password-digit").PasswordDigitError;
    static createAdvisor(firstname: string, lastname: string, email: string, password: string): User | import("../dist/errors/invalid-email-format").InvalidEmailFormatError | import("../dist/errors/password-length").PasswordLengthError | import("../dist/errors/password-uppercase").PasswordUppercaseError | import("../dist/errors/password-lowercase").PasswordLowercaseError | import("../dist/errors/password-special").PasswordSpecialError | import("../dist/errors/password-digit").PasswordDigitError;
    static createDirector(firstname: string, lastname: string, email: string, password: string): User | import("../dist/errors/invalid-email-format").InvalidEmailFormatError | import("../dist/errors/password-length").PasswordLengthError | import("../dist/errors/password-uppercase").PasswordUppercaseError | import("../dist/errors/password-lowercase").PasswordLowercaseError | import("../dist/errors/password-special").PasswordSpecialError | import("../dist/errors/password-digit").PasswordDigitError;
    update(props: Partial<Omit<User, 'identifier' | 'clientProps' | 'advisorProps' | 'directorProps'>>): User;
    static createFromRaw(identifier: string, firstname: string, lastname: string, email: string, password: string, clientProps?: ClientProps, advisorProps?: AdvisorProps, directorProps?: DirectorProps): User;
    updateClientProps(props: ClientProps): User;
    updateAdvisorProps(props: AdvisorProps): User;
    updateDirectorProps(props: DirectorProps): User;
    isAdvisor(): boolean;
    isDirector(): boolean;
    isClient(): boolean;
    static fromPrimitives(primitives: {
        identifier: string;
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        clientProps?: ClientProps;
        advisorProps?: AdvisorProps;
        directorProps?: DirectorProps;
    }): User;
}
//# sourceMappingURL=user.d.ts.map