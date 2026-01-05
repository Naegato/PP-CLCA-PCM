import { AccountRepository } from '../../../repositories/account.js';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
export declare class ClientUpdateNameAccount {
    readonly accountRepository: AccountRepository;
    constructor(accountRepository: AccountRepository);
    execute(account: Account, newName: string): Promise<import("../../../index.js").AccountUpdateError | Account>;
}
//# sourceMappingURL=client-update-name-account.d.ts.map