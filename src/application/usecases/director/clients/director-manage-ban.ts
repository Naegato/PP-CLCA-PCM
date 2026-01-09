import { Ban } from '@pp-clca-pcm/domain';
import { NotDirector } from "../../../errors/not-director.js";
import { UserNotFoundByIdError } from "../../../errors/user-not-found-by-id.js";
import { UserRepository } from "../../../repositories/user.js";
import { BanRepository } from "../../../repositories/ban.js";
import { Security } from "../../../services/security.js";

export class DirectorManageBan {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly banRepository: BanRepository,
    private readonly security: Security,
  ) {}

  public async execute(
    userId: string,
    reason: string,
    endDate?: Date,
  ): Promise<Ban | NotDirector | UserNotFoundByIdError> {
    const director = await this.security.getCurrentUser();

    if (!director.isDirector()) {
      return new NotDirector();
    }

    const user = await this.userRepository.findById(userId);

    if (user instanceof Error) {
      return user;
    }

    const ban = Ban.create(user, director, new Date(), reason, endDate);
    return await this.banRepository.save(ban);
  }
}
