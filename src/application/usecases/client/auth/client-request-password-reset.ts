import { UserNotFoundByEmailError } from '@pp-clca-pcm/application/errors/user-not-found-by-email';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { RequestPasswordResetRequest } from '@pp-clca-pcm/application/requests/request-password-reset';
import { RequestPasswordResetResponse } from '@pp-clca-pcm/application/responses/request-password-reset';
import { TokenService } from '@pp-clca-pcm/application/services/token';

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
