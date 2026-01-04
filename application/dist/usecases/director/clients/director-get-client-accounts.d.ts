import { User } from "@pp-clca-pcm/domain/entities/user";
import { UserRepository } from "../../../repositories/user";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
export declare class DirectorGetClientAccount {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(client: User): Promise<Error | Account[]>;
}
//# sourceMappingURL=director-get-client-accounts.d.ts.map