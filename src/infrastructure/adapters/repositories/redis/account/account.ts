import { AccountDeleteError } from "@pp-clca-pcm/application/errors/account-delete";
import { AccountRepository } from "@pp-clca-pcm/application/repositories/account";
import { Account } from "@pp-clca-pcm/domain/entities/accounts/account";
import { User } from "@pp-clca-pcm/domain/entities/user";
import { RedisBaseRepository } from "../base.js";
import { RedisClientType } from "redis";

export class RedisAccountRepository
  extends RedisBaseRepository<Account>
  implements AccountRepository
{
  readonly prefix = "account:";

  public constructor(
      redisClient: RedisClientType,
  ) {
      super(redisClient);
  }

  public async save(account: Account): Promise<Account> {
    // Use domain factory to create persisted account (generates identifier)
    const realAccount = Account.create(
      account.owner,
      account.type,
      account.iban,
      account.name,
      (account as any).portfolio
    );

    const key = this.key(realAccount);

    await this.redisClient.set(key, JSON.stringify(realAccount), { NX: true });

    return realAccount;
  }

  public async all(): Promise<Account[]> {
    const keys = await this.redisClient.keys(`${this.prefix}*`);
    const accounts: Account[] = [];

    for (const key of keys) {
      const value = await this.redisClient.get(key);
      if (value) {
        const data = JSON.parse(value) as Account;
        accounts.push(this.instanticate(data));
      }
    }

    return accounts;
  }

  public async delete(account: Account): Promise<Account | AccountDeleteError> {
    const key = this.key(account);

    const deleted = await this.redisClient.del(key);

    if (deleted === 0) {
      return new AccountDeleteError(account.identifier!);
    }

    return account;
  }

  public async update(account: Account): Promise<Account> {
    const key = this.key(account);

    await this.redisClient.set(key, JSON.stringify(account));

    return account;
  }

  public async generateAccountNumber(): Promise<string> {
    return `todo-i-guess`;
  }

  public async findByOwner(owner: User): Promise<Account[] | null> {
    const allAccounts = await this.all();
    const filtered = allAccounts.filter(
      (a) => a.owner?.identifier === owner.identifier
    );
    return filtered.length ? filtered : null;
  }

  public async findById(id: string): Promise<Account | null> {
    const key = this.key(id);
    const data = await this.redisClient.get(key);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return this.instanticate(parsed);
  }

  protected instanticate(entity: Account): Account {
    return Account.createFromRaw(
      entity.identifier!,
      entity.owner,
      entity.type,
      entity.emittedTransactions ?? [],
      entity.receivedTransactions ?? [],
      entity.iban,
      entity.name,
      (entity as any).portfolio,
    );
  }
}
