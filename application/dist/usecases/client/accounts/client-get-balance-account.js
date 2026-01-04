import { ClientGetBalanceAccountError } from '@pp-clca-pcm/application/errors/client-get-balance-account';
export class ClientGetBalanceAccount {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(accountId) {
        console.log('ClientGetBalanceAccount: execute called with accountId:', accountId);
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            console.log('ClientGetBalanceAccount: Account not found for ID', accountId);
            return new ClientGetBalanceAccountError('Account not found');
        }
        return account.balance;
    }
}
//# sourceMappingURL=client-get-balance-account.js.map