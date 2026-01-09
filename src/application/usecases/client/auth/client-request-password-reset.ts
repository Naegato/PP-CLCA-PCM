import { UserNotFoundByEmailError } from '@pp-clca-pcm/application';
import { UserRepository } from '@pp-clca-pcm/application';
import { RequestPasswordResetRequest } from '@pp-clca-pcm/application';
import { RequestPasswordResetResponse } from '@pp-clca-pcm/application';
import { TokenService } from '@pp-clca-pcm/application';

export class ClientRequestPasswordReset {
  public constructor(
    public readonly userRepository: UserRepository,
    public readonly tokenService: TokenService,
  ) {}

  public async execute(request: RequestPasswordResetRequest) {
    const { email } = request;
    const user = await this.userRepository.findByEmail(email);

    if (user instanceof Error) {
      return user;
    }

    if (!user.isClient()) {
      return new UserNotFoundByEmailError();
    }

    const token = await this.tokenService.generateResetToken(user.identifier!);

    if (token instanceof Error) {
      return token;
    }

    return new RequestPasswordResetResponse(token);
  }
}
