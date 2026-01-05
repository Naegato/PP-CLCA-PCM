import { AccountRepository } from "../../../repositories/account.js";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
export declare class ClientGetAccount {
    private readonly accountRepository;
    constructor(accountRepository: AccountRepository);
    execute(accountId: string): Promise<Account | null>;
}
//# sourceMappingURL=client-get-account.d.ts.map