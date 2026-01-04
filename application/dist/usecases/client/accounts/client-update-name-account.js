export class ClientUpdateNameAccount {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(account, newName) {
        const updatedAccount = account.update({
            name: newName,
        });
        const savedAccount = await this.accountRepository.update(updatedAccount);
        return savedAccount;
    }
}
//# sourceMappingURL=client-update-name-account.js.map