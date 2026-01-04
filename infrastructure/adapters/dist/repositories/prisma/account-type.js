import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
export class PrismaAccountTypeRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async all() {
        const types = await this.prisma.accountType.findMany();
        return types.map((type) => this.toDomain(type));
    }
    async getOrSave(name, accountType) {
        const existing = await this.prisma.accountType.findUnique({
            where: { name: name },
        });
        if (existing) {
            return this.toDomain(existing);
        }
        const created = await this.prisma.accountType.create({
            data: {
                name: accountType.name,
                rate: accountType.rate,
                limitByClient: accountType.limitByClient,
                description: accountType.description,
            },
        });
        return this.toDomain(created);
    }
    async save(accountType) {
        const existing = await this.prisma.accountType.findUnique({
            where: { name: accountType.name },
        });
        if (existing) {
            return new AccountTypeAlreadyExistError();
        }
        const created = await this.prisma.accountType.create({
            data: {
                name: accountType.name,
                rate: accountType.rate,
                limitByClient: accountType.limitByClient,
                description: accountType.description,
            },
        });
        return this.toDomain(created);
    }
    async update(accountType) {
        try {
            const updated = await this.prisma.accountType.update({
                where: { identifier: accountType.identifier },
                data: {
                    name: accountType.name,
                    rate: accountType.rate,
                    limitByClient: accountType.limitByClient,
                    description: accountType.description,
                },
            });
            return this.toDomain(updated);
        }
        catch {
            return new AccountTypeDoesNotExistError();
        }
    }
    toDomain(prismaType) {
        return AccountType.create(prismaType.name, prismaType.rate, prismaType.description).update({ identifier: prismaType.identifier, limitByClient: prismaType.limitByClient });
    }
}
//# sourceMappingURL=account-type.js.map