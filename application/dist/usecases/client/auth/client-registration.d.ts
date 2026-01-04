import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
export declare class ClientRegistration {
    readonly userRepository: UserRepository;
    readonly accountRepository: AccountRepository;
    readonly accountTypeRepository: AccountTypeRepository;
    constructor(userRepository: UserRepository, accountRepository: AccountRepository, accountTypeRepository: AccountTypeRepository);
    execute(firstname: string, lastname: string, email: string, password: string): Promise<Error | import("../../../errors/email-already-exist").EmailAlreadyExistError | User | import("@pp-clca-pcm/domain/errors/password-length").PasswordLengthError | import("@pp-clca-pcm/domain/errors/password-uppercase").PasswordUppercaseError | import("@pp-clca-pcm/domain/errors/password-lowercase").PasswordLowercaseError | import("@pp-clca-pcm/domain/errors/password-special").PasswordSpecialError | import("@pp-clca-pcm/domain/errors/password-digit").PasswordDigitError | import("@pp-clca-pcm/domain/errors/invalid-email-format").InvalidEmailFormatError | null>;
}
//# sourceMappingURL=client-registration.d.ts.map