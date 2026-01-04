import { Ban } from "@pp-clca-pcm/domain/entities/ban";
import { NotDirector } from "../../../errors/not-director";
import { UserNotFoundByIdError } from "../../../errors/user-not-found-by-id";
import { UserRepository } from "../../../repositories/user";
import { BanRepository } from "../../../repositories/ban";
import { Security } from "../../../services/security";
export declare class DirectorManageBan {
    private readonly userRepository;
    private readonly banRepository;
    private readonly security;
    constructor(userRepository: UserRepository, banRepository: BanRepository, security: Security);
    execute(userId: string, reason: string, endDate?: Date): Promise<Ban | NotDirector | UserNotFoundByIdError>;
}
//# sourceMappingURL=director-manage-ban.d.ts.map