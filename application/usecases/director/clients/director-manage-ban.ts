import { Ban } from "@pp-clca-pcm/domain/entities/ban";
import { NotDirector } from "../../../errors/not-director";
import { UserNotFoundByIdError } from "../../../errors/user-not-found-by-id";
import { UserRepository } from "../../../repositories/user";
import { BanRepository } from "../../../repositories/ban";
import { Security } from "../../../services/security";

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
    const director = this.security.getCurrentUser();

    if (!director.isDirector()) {
      return new NotDirector();
    }

    const user = await this.userRepository.findById(userId);

    if (user instanceof Error) {
      return user;
    }

    const ban = Ban.create(user, director, new Date(), reason, endDate ?? null);
    return await this.banRepository.save(ban);
  }
}
