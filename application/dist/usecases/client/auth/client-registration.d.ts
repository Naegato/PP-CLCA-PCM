import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
export declare class ClientRegistration {
    readonly userRepository: UserRepository;
    readonly accountRepository: AccountRepository;
    readonly accountTypeRepository: AccountTypeRepository;
    constructor(userRepository: UserRepository, accountRepository: AccountRepository, accountTypeRepository: AccountTypeRepository);
    execute(firstname: string, lastname: string, email: string, password: string): Promise<Error | import("../../../index.js").EmailAlreadyExistError | User | import("@pp-clca-pcm/domain/index").PasswordLengthError | import("@pp-clca-pcm/domain/index").PasswordUppercaseError | import("@pp-clca-pcm/domain/index").PasswordLowercaseError | import("@pp-clca-pcm/domain/index").PasswordSpecialError | import("@pp-clca-pcm/domain/index").PasswordDigitError | import("@pp-clca-pcm/domain/index").InvalidEmailFormatError | null>;
}
//# sourceMappingURL=client-registration.d.ts.map