import { User } from "@pp-clca-pcm/domain/entities/user";
import { NotDirector } from "../../../errors/not-director";
import { UserRepository } from "../../../repositories/user";
import { Security } from "../../../services/security";

export class DirectorManageCreate {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly security: Security,
  ) {}

  public async execute(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ): Promise<User | NotDirector | Error> {
    const director = this.security.getCurrentUser();

    if (!director.isDirector()) {
      return new NotDirector();
    }

    const client = User.create(firstname, lastname, email, password);

    if (client instanceof Error) {
      return client;
    }

    return await this.userRepository.save(client);
  }
}
