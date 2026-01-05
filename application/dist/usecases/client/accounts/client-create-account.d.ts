import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountRepository } from '../../../repositories/account.js';
import { AccountCreateError } from '../../../errors/account-create.js';
export declare class ClientCreateAccount {
    readonly defaultAccountType: AccountType;
    readonly accountRepository: AccountRepository;
    constructor(defaultAccountType: AccountType, accountRepository: AccountRepository);
    execute(user: User, name: string): Promise<Account | AccountCreateError>;
}
//# sourceMappingURL=client-create-account.d.ts.map