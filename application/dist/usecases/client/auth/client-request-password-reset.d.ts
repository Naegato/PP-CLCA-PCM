import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { RequestPasswordResetRequest } from '@pp-clca-pcm/application/requests/request-password-reset';
import { RequestPasswordResetResponse } from '@pp-clca-pcm/application/responses/request-password-reset';
import { TokenService } from '@pp-clca-pcm/application/services/token';
export declare class ClientRequestPasswordReset {
    readonly userRepository: UserRepository;
    readonly tokenService: TokenService;
    constructor(userRepository: UserRepository, tokenService: TokenService);
    execute(request: RequestPasswordResetRequest): Promise<import("../../../index.js").TokenSecretNotDefinedError | UserNotFoundByEmailError | RequestPasswordResetResponse>;
}
//# sourceMappingURL=client-request-password-reset.d.ts.map