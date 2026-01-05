import { UserNotFoundByIdError } from '@pp-clca-pcm/application/errors/user-not-found-by-id';
import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { ResetPasswordRequest } from '@pp-clca-pcm/application/requests/reset-password';
import { ResetPasswordResponse } from '@pp-clca-pcm/application/responses/reset-password';
import { PasswordService } from '@pp-clca-pcm/application/services/password';
import { TokenService } from '@pp-clca-pcm/application/services/token';
import { Password } from '@pp-clca-pcm/domain/value-objects/password';

export class ClientResetPassword {
  public constructor(
    public readonly userRepository: UserRepository,
    public readonly tokenService: TokenService,
    public readonly passwordService: PasswordService,
  ) {}

  public async execute(request: ResetPasswordRequest) {
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
    const hashedPasswordVO = Password.create(hashedPassword) as Password;

    const updatedUser = user.update({ password: hashedPasswordVO });
    const result = await this.userRepository.update(updatedUser);

    if (result instanceof Error) {
      return result;
    }

    return new ResetPasswordResponse(true);
  }
}
