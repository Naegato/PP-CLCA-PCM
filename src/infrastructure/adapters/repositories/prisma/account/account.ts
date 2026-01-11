import { AccountDeleteError } from '@pp-clca-pcm/application';
import { AccountRepository } from '@pp-clca-pcm/application';
import { AccountUpdateError } from '@pp-clca-pcm/application';
import { Account } from '@pp-clca-pcm/domain';
import { PrismaClient } from '@pp-clca-pcm/adapters';
import { User } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { Transaction } from '@pp-clca-pcm/domain';
import { FRENCH_IBAN_ATTRIBUTES } from '@pp-clca-pcm/domain';

export class PrismaAccountRepository implements AccountRepository {
  private lastAccountNumber = 0n;

  constructor(private readonly db: PrismaClient) {
    this.initializeLastAccountNumber();
  }

  private async initializeLastAccountNumber() {
    const lastAccount = await this.db.account.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (lastAccount) {
      const accountNumber = Iban.getAccountNumber(lastAccount.iban);

      if (accountNumber instanceof Error) {
        return accountNumber;
      }

      this.lastAccountNumber = BigInt(accountNumber);
    }
  }

  async save(account: Account): Promise<Account> {
    const existingAccount = await this.db.account.findUnique({
      where: { identifier: account.identifier! },
    });

    if (existingAccount) {
      await this.db.account.update({
        where: { identifier: account.identifier! },
        data: {
          ownerId: account.owner.identifier!,
          typeId: account.type.identifier!,
          iban: account.iban.value,
          name: account.name,
        },
      });
    } else {
      await this.db.account.create({
        data: {
          identifier: account.identifier!,
          ownerId: account.owner.identifier!,
          typeId: account.type.identifier!,
          iban: account.iban.value,
          name: account.name!,
        },
      });
    }

    return account;
  }

  async all(): Promise<Account[]> {
    const accounts = await this.db.account.findMany({
      include: this.includeRelations(),
    });

    const data = await Promise.all(accounts.map(account => this.mapToAccount(account)));

    const filtered: Account[] = [];

    for (const account of data) {
      if (!(account instanceof Error)) {
        filtered.push(account);
      }
    }

    return filtered;
  }

  async delete(account: Account): Promise<Account | AccountDeleteError> {
    try {
      await this.db.account.delete({
        where: { identifier: account.identifier! },
      });
      return account;
    } catch (error) {
      return new AccountDeleteError('Account not found');
    }
  }

  async update(account: Account): Promise<Account | AccountUpdateError> {
    try {
      await this.db.account.update({
        where: { identifier: account.identifier! },
        data: {
          ownerId: account.owner.identifier!,
          typeId: account.type.identifier!,
          iban: account.iban.value,
          name: account.name,
        },
      });
      return account;
    } catch (error) {
      return new AccountUpdateError('Account not found');
    }
  }

  async generateAccountNumber(): Promise<string> {
    this.lastAccountNumber = this.lastAccountNumber + 1n;
    const accountNumberString = this.lastAccountNumber.toString();
    return accountNumberString.padStart(FRENCH_IBAN_ATTRIBUTES.ACCOUNT_NUMBER_LENGTH, '0');
  }

  async findByOwner(owner: User): Promise<Account[] | null> {
    const accounts = await this.db.account.findMany({
      where: { ownerId: owner.identifier! },
      include: this.includeRelations(),
    });

    if (accounts.length === 0) {
      return null;
    }

    const data = await Promise.all(accounts.map(account => this.mapToAccount(account)));
    const filtered: Account[] = [];

    for (const account of data) {
      if (!(account instanceof Error)) {
        filtered.push(account);
      }
    }

    return filtered;
  }

  async findById(id: string) {
    const account = await this.db.account.findUnique({
      where: { identifier: id },
      include: this.includeRelations(),
    });

    if (!account) {
      return null;
    }

    const data = await this.mapToAccount(account);

    if (data instanceof Error) {
      return data
    }

    return data;
  }

  private includeRelations() {
    return {
      owner: true,
      type: true,
      emittedTransactions: true,
      receivedTransactions: true,
    };
  }

  private async mapToAccount(prismaAccount: any) {
    const owner = User.createFromRaw(
      prismaAccount.owner.identifier,
      prismaAccount.owner.firstname,
      prismaAccount.owner.lastname,
      prismaAccount.owner.email,
      prismaAccount.owner.password,
      prismaAccount.owner.clientProps ? JSON.parse(prismaAccount.owner.clientProps) : undefined,
      prismaAccount.owner.advisorProps ? JSON.parse(prismaAccount.owner.advisorProps) : undefined,
      prismaAccount.owner.directorProps ? JSON.parse(prismaAccount.owner.directorProps) : undefined,
    );

    const accountType = AccountType.createFromRaw(
      prismaAccount.type.identifier,
      prismaAccount.type.name,
      prismaAccount.type.rate,
      prismaAccount.type.limitByClient,
      prismaAccount.type.description,
    );

    const iban = Iban.create(prismaAccount.iban);

    if (iban instanceof Error) {
      return iban;
    }

    // Map transactions - we'll keep them simple for now
    // Note: This might cause circular references if we try to fully reconstruct transactions
    // with their full Account/Loan objects. We'll map to empty arrays for now.
    const emittedTransactions: Transaction[] = [];
    const receivedTransactions: Transaction[] = [];

    const account = Account.createFromRaw(
      prismaAccount.identifier,
      owner,
      accountType,
      emittedTransactions,
      receivedTransactions,
      iban,
      prismaAccount.name,
    );

    return account;
  }
}
