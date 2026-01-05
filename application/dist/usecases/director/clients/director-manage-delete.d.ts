import { NotDirector } from "../../../errors/not-director.js";
import { UserNotFoundByIdError } from "../../../errors/user-not-found-by-id.js";
import { UserRepository } from "../../../repositories/user.js";
import { Security } from "../../../services/security.js";
export declare class DirectorManageDelete {
    private readonly userRepository;
    private readonly security;
    constructor(userRepository: UserRepository, security: Security);
    execute(userId: string): Promise<void | NotDirector | UserNotFoundByIdError>;
}
//# sourceMappingURL=director-manage-delete.d.ts.map