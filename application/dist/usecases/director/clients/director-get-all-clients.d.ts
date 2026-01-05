import { UserRepository } from "../../../repositories/user.js";
export declare class DirectorGetAllClients {
    userRepository: UserRepository;
    constructor(userRepository: UserRepository);
    execute(): Promise<import("@pp-clca-pcm/domain/index").User[]>;
}
//# sourceMappingURL=director-get-all-clients.d.ts.map