import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
export class PrismaAccountTypeRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async all() {
        const types = await this.db.accountType.findMany();
        return types.map(typeRow => AccountType.createFromRaw(typeRow.identifier, typeRow.name, typeRow.rate, typeRow.limitByClient, typeRow.description));
    }
    async getOrSave(name, accountType) {
        const existingType = await this.db.accountType.findUnique({
            where: { name: name },
        });
        if (existingType) {
            return AccountType.createFromRaw(existingType.identifier, existingType.name, existingType.rate, existingType.limitByClient, existingType.description);
        }
        const savedType = await this.save(accountType);
        if (savedType instanceof AccountTypeAlreadyExistError) {
            throw new Error('Unexpected error: Account type should not exist at this point.');
        }
        return savedType;
    }
    async save(accountType) {
        const existingType = await this.db.accountType.findUnique({
            where: { name: accountType.name },
        });
        if (existingType) {
            return new AccountTypeAlreadyExistError(accountType.name);
        }
        const savedType = await this.db.accountType.create({
            data: {
                name: accountType.name,
                rate: accountType.rate,
                limitByClient: accountType.limitByClient,
                description: accountType.description,
            },
        });
        return AccountType.createFromRaw(savedType.identifier, savedType.name, savedType.rate, savedType.limitByClient, savedType.description);
    }
    async update(accountType) {
        if (!accountType.identifier) {
            return new AccountTypeDoesNotExistError(accountType.name);
        }
        const existingType = await this.db.accountType.findUnique({
            where: { identifier: accountType.identifier },
        });
        if (!existingType) {
            return new AccountTypeDoesNotExistError(accountType.name);
        }
        const updatedType = await this.db.accountType.update({
            where: { identifier: accountType.identifier },
            data: {
                name: accountType.name,
                rate: accountType.rate,
                limitByClient: accountType.limitByClient,
                description: accountType.description,
            },
        });
        return AccountType.createFromRaw(updatedType.identifier, updatedType.name, updatedType.rate, updatedType.limitByClient, updatedType.description);
    }
}
//# sourceMappingURL=type.js.map