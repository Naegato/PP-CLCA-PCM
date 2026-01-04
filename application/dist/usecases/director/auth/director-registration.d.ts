import { UserRepository } from '../../../repositories/user';
import { User } from '@pp-clca-pcm/domain/entities/user';
export declare class DirectorRegistration {
    readonly userRepositories: UserRepository;
    constructor(userRepositories: UserRepository);
    execute(firstname: string, lastname: string, email: string, password: string): Promise<import("../../../errors/email-already-exist").EmailAlreadyExistError | User | import("@pp-clca-pcm/domain/errors/password-length").PasswordLengthError | import("@pp-clca-pcm/domain/errors/password-uppercase").PasswordUppercaseError | import("@pp-clca-pcm/domain/errors/password-lowercase").PasswordLowercaseError | import("@pp-clca-pcm/domain/errors/password-special").PasswordSpecialError | import("@pp-clca-pcm/domain/errors/password-digit").PasswordDigitError | import("@pp-clca-pcm/domain/errors/invalid-email-format").InvalidEmailFormatError>;
}
//# sourceMappingURL=director-registration.d.ts.map