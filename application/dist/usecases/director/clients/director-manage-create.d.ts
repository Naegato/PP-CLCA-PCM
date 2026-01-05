import { User } from "@pp-clca-pcm/domain/entities/user";
import { NotDirector } from "../../../errors/not-director.js";
import { UserRepository } from "../../../repositories/user.js";
import { Security } from "../../../services/security.js";
export declare class DirectorManageCreate {
    private readonly userRepository;
    private readonly security;
    constructor(userRepository: UserRepository, security: Security);
    execute(firstname: string, lastname: string, email: string, password: string): Promise<User | NotDirector | Error>;
}
//# sourceMappingURL=director-manage-create.d.ts.map