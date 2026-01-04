import { User } from "@pp-clca-pcm/domain/entities/user";
import { NotDirector } from "../../../errors/not-director";
import { UserNotFoundByIdError } from "../../../errors/user-not-found-by-id";
import { UserRepository } from "../../../repositories/user";
import { Security } from "../../../services/security";
export declare class DirectorManageUpdate {
    private readonly userRepository;
    private readonly security;
    constructor(userRepository: UserRepository, security: Security);
    execute(userId: string, props: Parameters<typeof User.prototype.update>[0]): Promise<User | NotDirector | UserNotFoundByIdError | Error>;
}
//# sourceMappingURL=director-manage-update.d.ts.map