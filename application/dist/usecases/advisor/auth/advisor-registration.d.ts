import { User } from '@pp-clca-pcm/domain/entities/user';
import { UserRepository } from '../../../repositories/user.js';
export declare class AdvisorRegistration {
    readonly userRepositories: UserRepository;
    constructor(userRepositories: UserRepository);
    execute(firstname: string, lastname: string, email: string, password: string): Promise<import("../../../index.js").EmailAlreadyExistError | User | import("@pp-clca-pcm/domain/index").PasswordLengthError | import("@pp-clca-pcm/domain/index").PasswordUppercaseError | import("@pp-clca-pcm/domain/index").PasswordLowercaseError | import("@pp-clca-pcm/domain/index").PasswordSpecialError | import("@pp-clca-pcm/domain/index").PasswordDigitError | import("@pp-clca-pcm/domain/index").InvalidEmailFormatError>;
}
//# sourceMappingURL=advisor-registration.d.ts.map