import { RedisClientType } from 'redis';
import { randomUUID } from 'crypto';
import { AccountTypeRepository } from "@pp-clca-pcm/application/repositories/type";
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';
import { AccountTypeDoesNotExistError } from '@pp-clca-pcm/application/errors/account-type-does-not-exist';
import { RedisBaseRepository } from '../base.js';

export class RedisAccountTypeRepository
  extends RedisBaseRepository<AccountType>
  implements AccountTypeRepository
{
  readonly prefix = "account_type:";

  async save(
    accountType: AccountType
  ): Promise<AccountType | AccountTypeAlreadyExistError> {
    const realAccount = accountType.update({
      identifier: randomUUID(),
    });

    const key = this.key(realAccount);

    const created = await this.db.set(key, JSON.stringify(realAccount), {
      NX: true,
    });

    if (created === null) {
      return new AccountTypeAlreadyExistError(realAccount.name);
    }

    return realAccount;
  }

  async getOrSave(
    name: AccountTypeName,
    accountType: AccountType
  ): Promise<AccountType> {
    const key = this.key(name);

    const existing = await this.db.get(key);
    if (existing) {
      const data = JSON.parse(existing) as AccountType;
      this.instanticate(data);
    }

    const saved = await this.save(accountType);

    if (saved instanceof AccountTypeAlreadyExistError) {
      const value = await this.db.get(key);
      if (!value) {
        throw new Error("AccountType exists but could not be retrieved");
      }

      const data = JSON.parse(value) as AccountType;
      return this.instanticate(data);
    }

    return saved;
  }

  async all(): Promise<AccountType[]> {
    const keys = await this.db.keys(`${this.prefix}*`);
    const types: AccountType[] = [];

    for (const key of keys) {
      const value = await this.db.get(key);
      if (value) {
        const data = JSON.parse(value) as AccountType;
        types.push(this.instanticate(data));
      }
    }

    return types;
  }

  async update(
    accountType: AccountType
  ): Promise<AccountType | AccountTypeDoesNotExistError> {
    if (!accountType.identifier) {
      return new AccountTypeDoesNotExistError();
    }

    const key = this.key(accountType);
    const existing = await this.db.get(key);

    if (!existing) {
      return new AccountTypeDoesNotExistError();
    }

    await this.db.set(key, JSON.stringify(accountType));
    return accountType;
  }

  protected instanticate(entity: AccountType): AccountType {
    return AccountType.fromPrimitives({
      identifier: entity.identifier,
      name: entity.name,
      rate: entity.rate,
      limitByClient: entity.limitByClient,
      description: entity.description,
    });
  }
}
