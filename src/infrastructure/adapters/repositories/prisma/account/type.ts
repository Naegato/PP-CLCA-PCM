import { AccountTypeRepository } from '@pp-clca-pcm/application';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain';
import { PrismaClient } from '@pp-clca-pcm/adapters';

export class PrismaAccountTypeRepository implements AccountTypeRepository {
  constructor(private readonly db: PrismaClient) {
  }

  async all(): Promise<AccountType[]> {
    const types = await this.db.accountType.findMany();
    return types.map(typeRow => AccountType.createFromRaw(
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
      return AccountType.createFromRaw(
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

    return AccountType.createFromRaw(
      savedType.identifier,
      savedType.name as AccountTypeName,
      savedType.rate,
      savedType.limitByClient,
      savedType.description,
    );
  }

  async update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError> {
    if (!accountType.identifier) {
      return new AccountTypeDoesNotExistError();
    }

    const existingType = await this.db.accountType.findUnique({
      where: { identifier: accountType.identifier },
    });

    if (!existingType) {
      return new AccountTypeDoesNotExistError();
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

    return AccountType.createFromRaw(
      updatedType.identifier,
      updatedType.name as AccountTypeName,
      updatedType.rate,
      updatedType.limitByClient,
      updatedType.description,
    );
  }

}