import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { ResetPasswordRequest } from '@pp-clca-pcm/application/requests/reset-password';
import { ResetPasswordResponse } from '@pp-clca-pcm/application/responses/reset-password';
import { PasswordService } from '@pp-clca-pcm/application/services/password';
import { TokenService } from '@pp-clca-pcm/application/services/token';
export declare class ClientResetPassword {
    readonly userRepository: UserRepository;
    readonly tokenService: TokenService;
    readonly passwordService: PasswordService;
    constructor(userRepository: UserRepository, tokenService: TokenService, passwordService: PasswordService);
    execute(request: ResetPasswordRequest): Promise<import("../../../index.js").InvalidResetTokenError | import("../../../index.js").TokenSecretNotDefinedError | UserNotFoundByIdError | import("../../../index.js").UserUpdateError | ResetPasswordResponse | import("@pp-clca-pcm/domain/index").PasswordLengthError | import("@pp-clca-pcm/domain/index").PasswordUppercaseError | import("@pp-clca-pcm/domain/index").PasswordLowercaseError | import("@pp-clca-pcm/domain/index").PasswordSpecialError | import("@pp-clca-pcm/domain/index").PasswordDigitError>;
}
//# sourceMappingURL=client-reset-password.d.ts.map