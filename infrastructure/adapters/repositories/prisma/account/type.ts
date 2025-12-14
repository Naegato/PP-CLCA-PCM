import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';

export class PrismaAccountTypeRepository implements AccountTypeRepository {
  constructor(private readonly db: PrismaClient) {
  }

  async all(): Promise<AccountType[]> {
    const types = await this.db.accountType.findMany();
    return types.map(typeRow => new AccountType(
      typeRow.identifier,
      typeRow.name as AccountTypeName,
      typeRow.rate,
      typeRow.limitByClient,
      typeRow.description,
    ));
  }

  async getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType> {
    const existingType = await this.db.accountType.findUnique({
      where: { name: name },
    });

    if (existingType) {
      return new AccountType(
        existingType.identifier,
        existingType.name as AccountTypeName,
        existingType.rate,
        existingType.limitByClient,
        existingType.description,
      );
    }

    const savedType = await this.save(accountType);
    if (savedType instanceof AccountTypeAlreadyExistError) {
      throw new Error('Unexpected error: Account type should not exist at this point.');
    }
    return savedType;
  }

  async save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError> {
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

    return new AccountType(
      savedType.identifier,
      savedType.name as AccountTypeName,
      savedType.rate,
      savedType.limitByClient,
      savedType.description,
    );
  }

  async update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError> {
    const existingType = await this.db.accountType.findUnique({ where: { name: accountType.name } });
    if (!existingType) {
      return new AccountTypeDoesNotExistError(`Account type '${accountType.name}' does not exist`);
    }

    const updated = await this.db.accountType.update({
      where: { name: accountType.name },
      data: { rate: accountType.rate, limitByClient: accountType.limitByClient, description: accountType.description },
    });

    return new AccountType(updated.identifier, updated.name as AccountTypeName, updated.rate, updated.limitByClient, updated.description);
  }

}