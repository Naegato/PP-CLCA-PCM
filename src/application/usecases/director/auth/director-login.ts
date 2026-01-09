import { LoginInvalidCredentialsError } from '@pp-clca-pcm/application';
import { UserRepository } from '@pp-clca-pcm/application';
import { LoginRequest } from '@pp-clca-pcm/application';
import { LoginResponse } from '@pp-clca-pcm/application';
import { PasswordService } from '@pp-clca-pcm/application';
import { TokenService } from '@pp-clca-pcm/application';

export class DirectorLogin {
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

    if (!verify || !user.isDirector()) {
      return new LoginInvalidCredentialsError();
    }

    const token = await this.tokenService.generateToken(user.identifier!);

    if (token instanceof Error) {
      return token;
    }

    return new LoginResponse(token);
  }
}
