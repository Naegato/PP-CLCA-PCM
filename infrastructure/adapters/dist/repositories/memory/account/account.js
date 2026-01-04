import { AccountDeleteError } from '@pp-clca-pcm/application/errors/account-delete';
import { AccountUpdateError } from '@pp-clca-pcm/application/errors/account-update';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { FRENCH_IBAN_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/iban-fr';
export class InMemoryAccountRepository {
    inMemoryUserRepository;
    inMemoryAccounts = [];
    lastAccountNumber = 0n;
    constructor(inMemoryUserRepository) {
        this.inMemoryUserRepository = inMemoryUserRepository;
    }
    async save(account) {
        const existingIndex = this.inMemoryAccounts.findIndex((existingAccount) => existingAccount.identifier === account.identifier);
        if (existingIndex !== -1) {
            this.inMemoryAccounts[existingIndex] = account;
        }
        else {
            this.inMemoryAccounts.push(account);
        }
        const user = await this.inMemoryUserRepository.find(account.owner);
        if (user) {
            const updatedUser = user.updateClientProps(new ClientProps([...(user.clientProps?.accounts ?? []), account]));
            await this.inMemoryUserRepository.update(updatedUser);
        }
        return Promise.resolve(account);
    }
    async all() {
        return Promise.resolve([...this.inMemoryAccounts]);
    }
    async delete(account) {
        const index = this.inMemoryAccounts.findIndex((acc) => acc.identifier === account.identifier);
        if (index === -1) {
            return new AccountDeleteError('Account not found');
        }
        const [deletedAccount] = this.inMemoryAccounts.splice(index, 1);
        return Promise.resolve(deletedAccount);
    }
    async update(account) {
        const index = this.inMemoryAccounts.findIndex((acc) => acc.identifier === account.identifier);
        if (index === -1) {
            return new AccountUpdateError('Account not found');
        }
        this.inMemoryAccounts[index] = account;
        return Promise.resolve(account);
    }
    async generateAccountNumber() {
        this.lastAccountNumber = this.lastAccountNumber + 1n;
        const accountNumberString = this.lastAccountNumber.toString();
        return accountNumberString.padStart(FRENCH_IBAN_ATTRIBUTES.ACCOUNT_NUMBER_LENGTH, '0');
    }
    async findByOwner(owner) {
        const accounts = this.inMemoryAccounts.filter(account => account.owner.identifier === owner.identifier);
        return Promise.resolve(accounts || null);
    }
    async findById(id) {
        const account = this.inMemoryAccounts.find(account => account.identifier === id);
        return Promise.resolve(account || null);
    }
}
//# sourceMappingURL=account.js.map