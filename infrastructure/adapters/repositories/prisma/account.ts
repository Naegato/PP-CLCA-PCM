import { AccountRepository } from '@pp-clca-pcm/application/repositories/account';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { AccountDeleteError } from '@pp-clca-pcm/application/errors/account-delete';
import { AccountUpdateError } from '@pp-clca-pcm/application/errors/account-update';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';
import { PrismaClient } from './generated/client.js';

export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(account: Account): Promise<Account> {
    const created = await this.prisma.account.create({
      data: {
        identifier: account.identifier!,
        name: account.name || 'Account',
        iban: account.iban.value,
        balance: account.balance,
        ownerId: account.owner.identifier!,
        typeId: account.type.identifier!,
      },
      include: {
        owner: {
          include: {
            clientProps: true,
            advisorProps: true,
            directorProps: true,
          },
        },
        accountType: true,
      },
    });

    return this.toDomain(created);
  }

  async all(): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      include: {
        owner: {
          include: {
            clientProps: true,
            advisorProps: true,
            directorProps: true,
          },
        },
        accountType: true,
      },
    });

    return accounts.map((account) => this.toDomain(account));
  }

  async delete(account: Account): Promise<Account | AccountDeleteError> {
    try {
      await this.prisma.account.delete({
        where: { identifier: account.identifier! },
      });
      return account;
    } catch {
      return new AccountDeleteError();
    }
  }

  async update(account: Account): Promise<Account | AccountUpdateError> {
    try {
      const updated = await this.prisma.account.update({
        where: { identifier: account.identifier! },
        data: {
          name: account.name,
          typeId: account.type.identifier!,
        },
        include: {
          owner: {
            include: {
              clientProps: true,
              advisorProps: true,
              directorProps: true,
            },
          },
          accountType: true,
        },
      });

      return this.toDomain(updated);
    } catch {
      return new AccountUpdateError();
    }
  }

  async generateAccountNumber(): Promise<string> {
    const count = await this.prisma.account.count();
    return String(count + 1).padStart(11, '0');
  }

  async findByOwner(owner: User): Promise<Account[] | null> {
    const accounts = await this.prisma.account.findMany({
      where: { ownerId: owner.identifier! },
      include: {
        owner: {
          include: {
            clientProps: true,
            advisorProps: true,
            directorProps: true,
          },
        },
        accountType: true,
      },
    });

    if (accounts.length === 0) {
      return null;
    }

    return accounts.map((account) => this.toDomain(account));
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { identifier: id },
      include: {
        owner: {
          include: {
            clientProps: true,
            advisorProps: true,
            directorProps: true,
          },
        },
        accountType: true,
      },
    });

    if (!account) {
      return null;
    }

    return this.toDomain(account);
  }

  private toDomain(prismaAccount: {
    identifier: string;
    name: string;
    iban: string;
    balance: number;
    owner: {
      identifier: string;
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      clientProps: { identifier: string; userId: string } | null;
      advisorProps: { identifier: string; userId: string } | null;
      directorProps: { identifier: string; userId: string } | null;
    };
    accountType: {
      identifier: string;
      name: string;
      rate: number;
      limitByClient: number | null;
      description: string | null;
    };
  }): Account {
    const owner = User.createFromRaw(
      prismaAccount.owner.identifier,
      prismaAccount.owner.firstname,
      prismaAccount.owner.lastname,
      prismaAccount.owner.email,
      prismaAccount.owner.password,
      prismaAccount.owner.clientProps ? new ClientProps() : undefined,
      prismaAccount.owner.advisorProps ? new AdvisorProps() : undefined,
      prismaAccount.owner.directorProps ? new DirectorProps() : undefined,
    );

    const accountType = AccountType.create(
      prismaAccount.accountType.name,
      prismaAccount.accountType.rate,
      prismaAccount.accountType.description,
    ).update({ identifier: prismaAccount.accountType.identifier });

    const ibanOrError = Iban.create(prismaAccount.iban);
    if (ibanOrError instanceof Error) {
      throw new Error(`Invalid IBAN in database: ${prismaAccount.iban}`);
    }

    return Account.createFromRaw(
      prismaAccount.identifier,
      owner,
      accountType,
      ibanOrError,
      prismaAccount.name,
    );
  }
}
