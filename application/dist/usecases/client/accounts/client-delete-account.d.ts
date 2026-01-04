import { UserRepository } from '@pp-clca-pcm/application/repositories/user';
import { AccountRepository } from '../../../repositories/account';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountDeleteError } from '@pp-clca-pcm/application/errors/account-delete';
export declare class ClientDeleteAccount {
    readonly accountRepository: AccountRepository;
    readonly userRepository: UserRepository;
    constructor(accountRepository: AccountRepository, userRepository: UserRepository);
    execute(account: Account): Promise<null | AccountDeleteError>;
}
//# sourceMappingURL=client-delete-account.d.ts.map