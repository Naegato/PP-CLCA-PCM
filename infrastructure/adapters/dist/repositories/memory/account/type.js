import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
export class InMemoryAccountTypeRepository {
    inMemoryAccountTypes = [];
    save(accountType) {
        const typeAlreadyExist = this.inMemoryAccountTypes.find((type) => type.name === accountType.name);
        if (typeAlreadyExist) {
            return Promise.resolve(new AccountTypeAlreadyExistError());
        }
        this.inMemoryAccountTypes.push(accountType);
        return Promise.resolve(accountType);
    }
    getOrSave(name, accountType) {
        const existingType = this.inMemoryAccountTypes.find(type => type.name === name);
        if (existingType) {
            return Promise.resolve(existingType);
        }
        this.inMemoryAccountTypes.push(accountType);
        return Promise.resolve(accountType);
    }
    all() {
        return Promise.resolve(this.inMemoryAccountTypes);
    }
    update(accountType) {
        const index = this.inMemoryAccountTypes.findIndex((type) => type.name === accountType.name);
        if (index === -1) {
            return Promise.resolve(new AccountTypeDoesNotExistError(`Account type '${accountType.name}' does not exist`));
        }
        this.inMemoryAccountTypes[index] = accountType;
        return Promise.resolve(accountType);
    }
}
//# sourceMappingURL=type.js.map