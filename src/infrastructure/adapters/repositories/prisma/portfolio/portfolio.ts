import { PortfolioRepository } from '@pp-clca-pcm/application/repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain';
import { PrismaClient } from '@pp-clca-pcm/adapters/repositories/prisma/generated/client';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { PortfolioItem } from '@pp-clca-pcm/domain/entities/portfolio/portfolio-item';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Company } from '@pp-clca-pcm/domain/entities/company';

export class PrismaPortfolioRepository implements PortfolioRepository {
  constructor(private readonly db: PrismaClient) {}

  async save(portfolio: Portfolio): Promise<Portfolio> {
    const existingPortfolio = await this.db.portfolio.findUnique({
      where: { identifier: portfolio.identifier! },
    });

    if (existingPortfolio) {
      // Update existing portfolio
      await this.db.portfolio.update({
        where: { identifier: portfolio.identifier! },
        data: {
          accountId: portfolio.account.identifier!,
        },
      });

      // Delete existing items and recreate them
      await this.db.portfolioItem.deleteMany({
        where: { portfolioId: portfolio.identifier! },
      });
    } else {
      // Create new portfolio
      await this.db.portfolio.create({
        data: {
          identifier: portfolio.identifier!,
          accountId: portfolio.account.identifier!,
        },
      });
    }

    // Save portfolio items
    const items = (portfolio as any).items as Map<string, PortfolioItem>;
    if (items && items.size > 0) {
      const itemsToCreate = Array.from(items.values()).map(item => ({
        identifier: item.identifier!,
        portfolioId: portfolio.identifier!,
        stockId: item.stock.identifier!,
        quantity: item.quantity,
      }));

      await this.db.portfolioItem.createMany({
        data: itemsToCreate,
      });
    }

    return portfolio;
  }

  async findByAccountId(accountId: string) {
    const prismaPortfolio = await this.db.portfolio.findFirst({
      where: { accountId },
      include: {
        account: {
          include: {
            owner: true,
            type: true,
          },
        },
        items: {
          include: {
            stock: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });

    if (!prismaPortfolio) {
      return null;
    }

    return this.mapToPortfolio(prismaPortfolio);
  }

  async findAllByStockId(stockId: string): Promise<Portfolio[]> {
    const portfolios = await this.db.portfolio.findMany({
      where: {
        items: {
          some: {
            stockId,
            quantity: { gt: 0 },
          },
        },
      },
      include: {
        account: {
          include: {
            owner: true,
            type: true,
          },
        },
        items: {
          include: {
            stock: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });

    const data = portfolios.map(portfolio => this.mapToPortfolio(portfolio));

    const filtered: Portfolio[] = []

    for (const portfolio of data) {
      if (!(portfolio instanceof Error)) {
        filtered.push(portfolio);
      }
    }

    return filtered;
  }

  private mapToPortfolio(prismaPortfolio: any) {
    const owner = User.createFromRaw(
      prismaPortfolio.account.owner.identifier,
      prismaPortfolio.account.owner.firstname,
      prismaPortfolio.account.owner.lastname,
      prismaPortfolio.account.owner.email,
      prismaPortfolio.account.owner.password,
      prismaPortfolio.account.owner.clientProps ? JSON.parse(prismaPortfolio.account.owner.clientProps) : undefined,
      prismaPortfolio.account.owner.advisorProps ? JSON.parse(prismaPortfolio.account.owner.advisorProps) : undefined,
      prismaPortfolio.account.owner.directorProps ? JSON.parse(prismaPortfolio.account.owner.directorProps) : undefined,
    );

    const accountType = AccountType.createFromRaw(
      prismaPortfolio.account.type.identifier,
      prismaPortfolio.account.type.name,
      prismaPortfolio.account.type.rate,
      prismaPortfolio.account.type.limitByClient,
      prismaPortfolio.account.type.description,
    );

    const iban = Iban.create(prismaPortfolio.account.iban);

    if (iban instanceof Error) {
      return iban;
    }

    const account = Account.createFromRaw(
      prismaPortfolio.account.identifier,
      owner,
      accountType,
      [], // emittedTransactions
      [], // receivedTransactions
      iban,
      prismaPortfolio.account.name,
    );

    const items = new Map<string, PortfolioItem>();
    if (prismaPortfolio.items) {
      for (const item of prismaPortfolio.items) {
        const company = new (Company as any)(
          item.stock.company.identifier,
          item.stock.company.name,
        );

        const stock = new (Stock as any)(
          item.stock.identifier,
          item.stock.symbol,
          item.stock.name,
          item.stock.isListed,
          item.stock.createdAt,
          company,
        );

        const portfolioItem = new (PortfolioItem as any)(
          item.identifier,
          stock,
          item.quantity,
        );

        items.set(item.stockId, portfolioItem);
      }
    }

    return Portfolio.createFromRaw(
      prismaPortfolio.identifier,
      account,
      items,
    );
  }
}
