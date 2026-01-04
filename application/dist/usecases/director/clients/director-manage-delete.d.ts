import { NotDirector } from "../../../errors/not-director";
import { UserNotFoundByIdError } from "../../../errors/user-not-found-by-id";
import { UserRepository } from "../../../repositories/user";
import { Security } from "../../../services/security";
export declare class DirectorManageDelete {
    private readonly userRepository;
    private readonly security;
    constructor(userRepository: UserRepository, security: Security);
    execute(userId: string): Promise<void | NotDirector | UserNotFoundByIdError>;
}
//# sourceMappingURL=director-manage-delete.d.ts.map