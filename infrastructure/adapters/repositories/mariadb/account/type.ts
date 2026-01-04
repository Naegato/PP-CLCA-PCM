import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { AccountTypeRepository } from '@pp-clca-pcm/application/repositories/type';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { Database } from '@pp-clca-pcm/adapters/repositories/mariadb/database';

export class MariaDbAccountTypeRepository implements AccountTypeRepository {
  constructor(private readonly db: Database) {
  }

  all(): Promise<AccountType[]> {
    return this.db.sql('SELECT * FROM type').then(rows => {
      return rows.map((typeRow: any) => AccountType.createFromRaw(
        typeRow.id.toString(),
        typeRow.name,
        typeRow.rate,
        typeRow.limitByClient,
        typeRow.description,
      ));
    });
  }

  async getOrSave(name: AccountTypeName, accountType: AccountType): Promise<AccountType> {
    const existingTypes = await this.db.sql('SELECT * FROM type WHERE name = ?', [name]);
    if (existingTypes.length > 0) {
      const typeRow = existingTypes[0];
      return AccountType.createFromRaw(
        typeRow.id.toString(),
        typeRow.name,
        typeRow.rate,
        typeRow.limitByClient,
        typeRow.description,
      );
    }

    const savedType = await this.save(accountType);
    if (savedType instanceof AccountTypeAlreadyExistError) {
      throw new Error('Unexpected error: Account type should not exist at this point.');
    }
    return savedType;
  }

  async save(accountType: AccountType): Promise<AccountType | AccountTypeAlreadyExistError> {
    const existingTypes = await this.db.sql('SELECT * FROM type WHERE name = ?', [accountType.name]);
    if (existingTypes.length > 0) {
      return new AccountTypeAlreadyExistError(accountType.name);
    }

    const res = await this.db.sql('INSERT INTO type (name, rate, limitByClient, description) VALUES (?, ?, ?, ?)', [
      accountType.name,
      accountType.rate,
      accountType.limitByClient,
      accountType.description,
    ])

    const savedAccountTypeId = Number(res.insertId).toString();
    return AccountType.createFromRaw(
      savedAccountTypeId,
      accountType.name,
      accountType.rate,
      accountType.limitByClient,
      accountType.description,
    );
  }

  async update(accountType: AccountType): Promise<AccountType | AccountTypeDoesNotExistError> {
    if (!accountType.identifier) {
      return new AccountTypeDoesNotExistError(accountType.name);
    }

    const existingTypes = await this.db.sql('SELECT * FROM type WHERE id = ?', [accountType.identifier]);
    if (existingTypes.length === 0) {
      return new AccountTypeDoesNotExistError(accountType.name);
    }

    await this.db.sql('UPDATE type SET name = ?, rate = ?, limitByClient = ?, description = ? WHERE id = ?', [
      accountType.name,
      accountType.rate,
      accountType.limitByClient,
      accountType.description,
      accountType.identifier,
    ]);

    return accountType;
  }
}