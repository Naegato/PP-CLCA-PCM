import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { ClientGetBalanceAccountError } from '@pp-clca-pcm/application/errors/client-get-balance-account';
export declare class ClientGetBalanceAccount {
    private readonly accountRepository;
    constructor(accountRepository: AccountRepository);
    execute(accountId: string): Promise<number | ClientGetBalanceAccountError>;
}
//# sourceMappingURL=client-get-balance-account.d.ts.map