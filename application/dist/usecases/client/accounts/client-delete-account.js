import { AccountDeleteError } from '@pp-clca-pcm/application/errors/account-delete';
export class ClientDeleteAccount {
    accountRepository;
    userRepository;
    constructor(accountRepository, userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }
    async execute(account) {
        const userAccounts = await this.accountRepository.findByOwner(account.owner);
        if (!userAccounts || userAccounts.length <= 1) {
            return new AccountDeleteError('User must have at least one account');
        }
        if (account.balance !== 0) {
            return new AccountDeleteError('Account balance must be zero to delete the account');
        }
        await this.accountRepository.delete(account);
        return null;
    }
}
//# sourceMappingURL=client-delete-account.js.map