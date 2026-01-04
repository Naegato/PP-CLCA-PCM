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
    execute(request: ResetPasswordRequest): Promise<import("../../../errors/invalid-reset-token").InvalidResetTokenError | import("../../../errors/token-secret-not-defined-error").TokenSecretNotDefinedError | UserNotFoundByIdError | import("../../../errors/user-update").UserUpdateError | ResetPasswordResponse | import("@pp-clca-pcm/domain/errors/password-length").PasswordLengthError | import("@pp-clca-pcm/domain/errors/password-uppercase").PasswordUppercaseError | import("@pp-clca-pcm/domain/errors/password-lowercase").PasswordLowercaseError | import("@pp-clca-pcm/domain/errors/password-special").PasswordSpecialError | import("@pp-clca-pcm/domain/errors/password-digit").PasswordDigitError>;
}
//# sourceMappingURL=client-reset-password.d.ts.map