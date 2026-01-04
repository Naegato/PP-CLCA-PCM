export class ClientGetAccount {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(accountId) {
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            return null;
        }
        return account;
    }
}
//# sourceMappingURL=client-get-account.js.map