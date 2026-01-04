import { LoginInvalidCredentialsError } from '@pp-clca-pcm/application/errors/login-invalid-credentials';
import { LoginResponse } from '@pp-clca-pcm/application/responses/login';
export class ClientLogin {
    userRepository;
    passwordService;
    tokenService;
    constructor(userRepository, passwordService, tokenService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
    }
    async execute(request) {
        const { email, password } = request;
        const user = await this.userRepository.findByEmail(email);
        if (user instanceof Error) {
            return user;
        }
        const verify = await this.passwordService.comparePassword(password, user.password.value);
        if (!verify || !user.isClient()) {
            return new LoginInvalidCredentialsError();
        }
        const token = await this.tokenService.generateToken(user.identifier);
        if (token instanceof Error) {
            return token;
        }
        return new LoginResponse(token);
    }
}
//# sourceMappingURL=client-login.js.map