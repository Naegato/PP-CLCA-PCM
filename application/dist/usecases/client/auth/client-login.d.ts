import { LoginInvalidCredentialsError } from '@pp-clca-pcm/application/errors/login-invalid-credentials';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { LoginRequest } from '@pp-clca-pcm/application/requests/login';
import { LoginResponse } from '@pp-clca-pcm/application/responses/login';
import { PasswordService } from '@pp-clca-pcm/application/services/password';
import { TokenService } from '@pp-clca-pcm/application/services/token';
export declare class ClientLogin {
    readonly userRepository: UserRepository;
    readonly passwordService: PasswordService;
    readonly tokenService: TokenService;
    constructor(userRepository: UserRepository, passwordService: PasswordService, tokenService: TokenService);
    execute(request: LoginRequest): Promise<LoginInvalidCredentialsError | import("../../../errors/token-secret-not-defined-error").TokenSecretNotDefinedError | import("../../../errors/user-not-found-by-email").UserNotFoundByEmailError | LoginResponse>;
}
//# sourceMappingURL=client-login.d.ts.map