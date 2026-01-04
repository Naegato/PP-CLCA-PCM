import { UserRepository } from "../../../repositories/user";
export declare class DirectorGetAllClients {
    userRepository: UserRepository;
    constructor(userRepository: UserRepository);
    execute(): Promise<import("@pp-clca-pcm/domain/entities/user").User[]>;
}
//# sourceMappingURL=director-get-all-clients.d.ts.map