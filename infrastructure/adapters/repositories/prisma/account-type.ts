import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { PrismaClient } from './generated/client.js';

export class PrismaAccountTypeRepository implements AccountTypeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async all(): Promise<AccountType[]> {
    const types = await this.prisma.accountType.findMany();
    return types.map((type) => this.toDomain(type));
  }

  async getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType> {
    const existing = await this.prisma.accountType.findUnique({
      where: { name: name as string },
    });

    if (existing) {
      return this.toDomain(existing);
    }

    const created = await this.prisma.accountType.create({
      data: {
        name: accountType.name as string,
        rate: accountType.rate,
        limitByClient: accountType.limitByClient,
        description: accountType.description,
      },
    });

    return this.toDomain(created);
  }

  async save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError> {
    const existing = await this.prisma.accountType.findUnique({
      where: { name: accountType.name as string },
    });

    if (existing) {
      return new AccountTypeAlreadyExistError();
    }

    const created = await this.prisma.accountType.create({
      data: {
        name: accountType.name as string,
        rate: accountType.rate,
        limitByClient: accountType.limitByClient,
        description: accountType.description,
      },
    });

    return this.toDomain(created);
  }

  async update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError> {
    try {
      const updated = await this.prisma.accountType.update({
        where: { identifier: accountType.identifier! },
        data: {
          name: accountType.name as string,
          rate: accountType.rate,
          limitByClient: accountType.limitByClient,
          description: accountType.description,
        },
      });

      return this.toDomain(updated);
    } catch {
      return new AccountTypeDoesNotExistError();
    }
  }

  private toDomain(prismaType: {
    identifier: string;
    name: string;
    rate: number;
    limitByClient: number | null;
    description: string | null;
  }): AccountType {
    return AccountType.create(
      prismaType.name,
      prismaType.rate,
      prismaType.description,
    ).update({ identifier: prismaType.identifier, limitByClient: prismaType.limitByClient });
  }
}
