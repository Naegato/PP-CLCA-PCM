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
    static create(firstname: string, lastname: string, email: string, password: string): User | import("../index.js").PasswordLengthError | import("../index.js").PasswordUppercaseError | import("../index.js").PasswordLowercaseError | import("../index.js").PasswordSpecialError | import("../index.js").PasswordDigitError | import("../index.js").InvalidEmailFormatError;
    static createAdvisor(firstname: string, lastname: string, email: string, password: string): User | import("../index.js").PasswordLengthError | import("../index.js").PasswordUppercaseError | import("../index.js").PasswordLowercaseError | import("../index.js").PasswordSpecialError | import("../index.js").PasswordDigitError | import("../index.js").InvalidEmailFormatError;
    static createDirector(firstname: string, lastname: string, email: string, password: string): User | import("../index.js").PasswordLengthError | import("../index.js").PasswordUppercaseError | import("../index.js").PasswordLowercaseError | import("../index.js").PasswordSpecialError | import("../index.js").PasswordDigitError | import("../index.js").InvalidEmailFormatError;
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