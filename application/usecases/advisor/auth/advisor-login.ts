import { LoginInvalidCredentialsError } from '@pp-clca-pcm/application/errors/login-invalid-credentials';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { LoginRequest } from '@pp-clca-pcm/application/requests/login';
import { LoginResponse } from '@pp-clca-pcm/application/responses/login';
import { PasswordService } from '@pp-clca-pcm/application/services/password';
import { TokenService } from '@pp-clca-pcm/application/services/token';

export class AdvisorLogin {
  public constructor(
    public readonly userRepository: UserRepository,
    public readonly passwordService: PasswordService,
    public readonly tokenService: TokenService,
  ) {}

  public async execute(request: LoginRequest) {
    const { email, password } = request;
    const user = await this.userRepository.findByEmail(email);

    if (user instanceof Error) {
      return user;
    }

    const verify = await this.passwordService.comparePassword(password, user.password.value);

    if (!verify || !user.isAdvisor()) {
      return new LoginInvalidCredentialsError();
    }

    const token = await this.tokenService.generateToken(user.identifier);

    if (token instanceof Error) {
      return token;
    }

    return new LoginResponse(token);
  }
}
