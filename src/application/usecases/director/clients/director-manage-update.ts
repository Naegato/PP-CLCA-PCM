import { User } from '@pp-clca-pcm/domain';
import { NotDirector } from "../../../errors/not-director.js";
import { UserNotFoundByIdError } from "../../../errors/user-not-found-by-id.js";
import { UserRepository } from "../../../repositories/user.js";
import { Security } from "../../../services/security.js";

export class DirectorManageUpdate {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly security: Security,
  ) {}

  public async execute(
    userId: string,
    props: Parameters<typeof User.prototype.update>[0],
  ): Promise<User | NotDirector | UserNotFoundByIdError | Error> {
    const director = await this.security.getCurrentUser();

    if (!director || director.isDirector()) {
      return new NotDirector();
    }

    const user = await this.userRepository.findById(userId);

    if (user instanceof Error) {
      return user;
    }

    const updatedUser = user.update(props);

    if (updatedUser instanceof Error) {
      return updatedUser;
    }

    return await this.userRepository.update(updatedUser);
  }
}
