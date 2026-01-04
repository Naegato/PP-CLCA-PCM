import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { ResetPasswordResponse } from '@pp-clca-pcm/application/responses/reset-password';
import { Password } from '@pp-clca-pcm/domain/value-objects/password';
export class ClientResetPassword {
    userRepository;
    tokenService;
    passwordService;
    constructor(userRepository, tokenService, passwordService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordService = passwordService;
    }
    async execute(request) {
        const { token, newPassword } = request;
        const userId = await this.tokenService.verifyResetToken(token);
        if (userId instanceof Error) {
            return userId;
        }
        const user = await this.userRepository.findById(userId);
        if (user instanceof Error) {
            return user;
        }
        if (!user.isClient()) {
            return new UserNotFoundByIdError();
        }
        const newPasswordVO = Password.create(newPassword);
        if (newPasswordVO instanceof Error) {
            return newPasswordVO;
        }
        const hashedPassword = await this.passwordService.hashPassword(newPassword);
        const hashedPasswordVO = Password.create(hashedPassword);
        const updatedUser = user.update({ password: hashedPasswordVO });
        const result = await this.userRepository.update(updatedUser);
        if (result instanceof Error) {
            return result;
        }
        return new ResetPasswordResponse(true);
    }
}
//# sourceMappingURL=client-reset-password.js.map