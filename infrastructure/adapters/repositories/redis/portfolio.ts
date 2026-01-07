import { PortfolioRepository } from '@pp-clca-pcm/application/repositories/portfolio';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { RedisClientType } from 'redis';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';

export class RedisPortfolioRepository implements PortfolioRepository {
  private readonly PORTFOLIO_KEY = 'portfolio';

  constructor(private readonly redisClient: RedisClientType) {}

  async save(portfolio: Portfolio): Promise<Portfolio> {
    if (!portfolio.identifier) {
      throw new Error('Portfolio identifier is required to save.');
    }

    const portfolioData = {
      identifier: portfolio.identifier,
      account: {
        identifier: portfolio.account.identifier,
        owner: {
          identifier: portfolio.account.owner.identifier,
          firstname: portfolio.account.owner.firstname,
          lastname: portfolio.account.owner.lastname,
          email: portfolio.account.owner.email.value,
          password: portfolio.account.owner.password.value,
          clientProps: portfolio.account.owner.clientProps,
          advisorProps: portfolio.account.owner.advisorProps,
          directorProps: portfolio.account.owner.directorProps,
        },
        type: {
          identifier: portfolio.account.type.identifier,
          name: portfolio.account.type.name,
          rate: portfolio.account.type.rate,
          limitByClient: portfolio.account.type.limitByClient,
          description: portfolio.account.type.description,
        },
        emittedTransactions: portfolio.account.emittedTransactions,
        receivedTransactions: portfolio.account.receivedTransactions,
        iban: portfolio.account.iban.value,
        name: portfolio.account.name,
      },
      items: Array.from(portfolio['items'].values()).map(item => ({
        identifier: item.identifier,
        stock: {
          identifier: item.stock.identifier,
          symbol: item.stock.symbol,
          name: item.stock.name,
          isListed: item.stock.isListed,
          createdAt: item.stock.createdAt.toISOString(),
          company: {
            identifier: item.stock.company.identifier,
            name: item.stock.company.name,
          },
        },
        quantity: item.quantity,
      })),
    };

    await this.redisClient.hSet(this.PORTFOLIO_KEY, portfolio.identifier, JSON.stringify(portfolioData));
    return portfolio;
  }

  async findByAccountId(accountId: string): Promise<Portfolio | null> {
    const allPortfolios = await this.redisClient.hGetAll(this.PORTFOLIO_KEY);
    for (const portfolioId in allPortfolios) {
      const portfolioData = JSON.parse(allPortfolios[portfolioId]);
      if (portfolioData.account.identifier === accountId) {
        return this.mapToPortfolio(portfolioData);
      }
    }
    return null;
  }

  async findAllByStockId(stockId: string): Promise<Portfolio[]> {
    const allPortfolios = await this.redisClient.hGetAll(this.PORTFOLIO_KEY);
    const foundPortfolios: Portfolio[] = [];
    for (const portfolioId in allPortfolios) {
      const portfolioData = JSON.parse(allPortfolios[portfolioId]);
      if (portfolioData.items.some((item: any) => item.stock.identifier === stockId)) {
        foundPortfolios.push(this.mapToPortfolio(portfolioData));
      }
    }
    return foundPortfolios;
  }

  private mapToPortfolio(data: any): Portfolio {
    const owner = User.fromPrimitives({
      identifier: data.account.owner.identifier,
      firstname: data.account.owner.firstname,
      lastname: data.account.owner.lastname,
      email: data.account.owner.email,
      password: data.account.owner.password,
      clientProps: data.account.owner.clientProps,
      advisorProps: data.account.owner.advisorProps,
      directorProps: data.account.owner.directorProps,
    });

    const accountType = AccountType.fromPrimitives({
      identifier: data.account.type.identifier,
      name: data.account.type.name,
      rate: data.account.type.rate,
      limitByClient: data.account.type.limitByClient,
      description: data.account.type.description,
    });

    const iban = Iban.create(data.account.iban) as Iban;

    const account = Account.fromPrimitives({
      identifier: data.account.identifier,
      owner: owner,
      type: accountType,
      emittedTransactions: data.account.emittedTransactions,
      receivedTransactions: data.account.receivedTransactions,
      iban: iban,
      name: data.account.name,
    });

    const items = data.items.map((item: any) => {
      const company = Company.fromPrimitives({
        identifier: item.stock.company.identifier,
        name: item.stock.company.name,
      });
      const stock = Stock.fromPrimitives({
        identifier: item.stock.identifier,
        symbol: item.stock.symbol,
        name: item.stock.name,
        isListed: item.stock.isListed,
        createdAt: new Date(item.stock.createdAt),
        company: company,
      });
      return { stock, quantity: item.quantity };
    });

    return Portfolio.fromPrimitives({
      identifier: data.identifier,
      account: account,
      items: items,
    });
  }
}
