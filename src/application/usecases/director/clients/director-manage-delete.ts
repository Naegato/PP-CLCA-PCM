import { NotDirector } from "../../../errors/not-director.js";
import { UserNotFoundByIdError } from "../../../errors/user-not-found-by-id.js";
import { UserRepository } from "../../../repositories/user.js";
import { Security } from "../../../services/security.js";

export class DirectorManageDelete {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly security: Security,
  ) {}

  public async execute(userId: string): Promise<void | NotDirector | UserNotFoundByIdError> {
    const director = await this.security.getCurrentUser();

    if (!director.isDirector()) {
      return new NotDirector();
    }

    const user = await this.userRepository.findById(userId);

    if (user instanceof Error) {
      return user;
    }

    await this.userRepository.delete(userId);
  }
}
