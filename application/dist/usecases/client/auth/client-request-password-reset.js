import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { RequestPasswordResetResponse } from '@pp-clca-pcm/application/responses/request-password-reset';
export class ClientRequestPasswordReset {
    userRepository;
    tokenService;
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }
    async execute(request) {
        const { email } = request;
        const user = await this.userRepository.findByEmail(email);
        if (user instanceof Error) {
            return user;
        }
        if (!user.isClient()) {
            return new UserNotFoundByEmailError();
        }
        const token = await this.tokenService.generateResetToken(user.identifier);
        if (token instanceof Error) {
            return token;
        }
        return new RequestPasswordResetResponse(token);
    }
}
//# sourceMappingURL=client-request-password-reset.js.map