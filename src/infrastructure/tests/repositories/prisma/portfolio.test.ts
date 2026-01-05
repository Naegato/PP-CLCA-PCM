import { PrismaPortfolioRepository } from '@pp-clca-pcm/adapters/repositories/prisma/portfolio/portfolio';
import { prisma } from '@pp-clca-pcm/adapters/repositories/prisma/client';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { beforeAll, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma Portfolio Repository', async () => {
  const repository = new PrismaPortfolioRepository(prisma);

  beforeAll(async () => {
    await prisma.$transaction([
      prisma.portfolioItem.deleteMany(),
      prisma.portfolio.deleteMany(),
      prisma.stock.deleteMany(),
      prisma.account.deleteMany(),
      prisma.accountType.deleteMany(),
      prisma.company.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  const createTestUser = async (id: string = crypto.randomUUID()) => {
    const user = User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `user-${id}@test.com`,
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });

    await prisma.user.create({
      data: {
        identifier: user.identifier!,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email.value,
        password: user.password.value,
        clientProps: JSON.stringify(user.clientProps),
      },
    });

    return user;
  };

  const createTestAccountType = async () => {
    const accountType = AccountType.create(AccountTypeNameEnum.DEFAULT, 0);
    await prisma.accountType.create({
      data: {
        identifier: accountType.identifier!,
        name: accountType.name,
        rate: accountType.rate,
        limitByClient: accountType.limitByClient,
        description: accountType.description,
      },
    });
    return accountType;
  };

  const createTestAccount = async (user: User, accountType: AccountType) => {
    const accountNumber = Math.random().toString().substring(2, 13);
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Test Account');

    await prisma.account.create({
      data: {
        identifier: account.identifier!,
        ownerId: user.identifier!,
        typeId: accountType.identifier!,
        iban: iban.value,
        name: account.name,
      },
    });

    return account;
  };

  const createTestCompany = async (name: string = `Company-${crypto.randomUUID()}`) => {
    const company = Company.create(name);
    await prisma.company.create({
      data: {
        identifier: company.identifier,
        name: company.name,
      },
    });
    return company;
  };

  const createTestStock = async (company: Company, symbol: string = `STK${Math.random().toString(36).substring(7).toUpperCase()}`) => {
    const stock = Stock.create(symbol, `Stock ${symbol}`, company);
    await prisma.stock.create({
      data: {
        identifier: stock.identifier!,
        symbol: stock.symbol,
        name: stock.name,
        isListed: stock.isListed,
        createdAt: stock.createdAt,
        companyId: company.identifier,
      },
    });
    return stock;
  };

  test('save - should save empty portfolio', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);

    const portfolio = Portfolio.create(account);
    const saved = await repository.save(portfolio);

    expect(saved.identifier).toBeDefined();
    expect(saved.account.identifier).toBe(account.identifier);
  });

  test('save - should save portfolio with stocks', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    let portfolio = Portfolio.create(account);
    portfolio = portfolio.addStock(stock, 10) as Portfolio;

    const saved = await repository.save(portfolio);

    expect(saved.getOwnedQuantity(stock.identifier!)).toBe(10);
  });

  test('findByAccountId - should find portfolio by account', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);

    const portfolio = Portfolio.create(account);
    await repository.save(portfolio);

    const found = await repository.findByAccountId(account.identifier!);

    expect(found).not.toBeNull();
    expect(found?.account.identifier).toBe(account.identifier);
  });

  test('findByAccountId - should return null for non-existent account', async () => {
    const found = await repository.findByAccountId('non-existent-account-id');

    expect(found).toBeNull();
  });

  test('findAllByStockId - should find portfolios containing a stock', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account1 = await createTestAccount(user, accountType);
    const account2 = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    let portfolio1 = Portfolio.create(account1);
    portfolio1 = portfolio1.addStock(stock, 10) as Portfolio;
    await repository.save(portfolio1);

    let portfolio2 = Portfolio.create(account2);
    portfolio2 = portfolio2.addStock(stock, 5) as Portfolio;
    await repository.save(portfolio2);

    const portfolios = await repository.findAllByStockId(stock.identifier!);

    expect(portfolios.length).toBeGreaterThanOrEqual(2);
    expect(portfolios.every(p => p.getOwnedQuantity(stock.identifier!) > 0)).toBe(true);
  });

  test('save - should update existing portfolio', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    let portfolio = Portfolio.create(account);
    await repository.save(portfolio);

    portfolio = portfolio.addStock(stock, 10) as Portfolio;
    await repository.save(portfolio);

    const found = await repository.findByAccountId(account.identifier!);

    expect(found).not.toBeNull();
    expect(found?.getOwnedQuantity(stock.identifier!)).toBe(10);
  });

  test('save - should handle multiple stocks', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock1 = await createTestStock(company, 'AAA');
    const stock2 = await createTestStock(company, 'BBB');

    let portfolio = Portfolio.create(account);
    portfolio = portfolio.addStock(stock1, 10) as Portfolio;
    portfolio = portfolio.addStock(stock2, 5) as Portfolio;

    await repository.save(portfolio);

    const found = await repository.findByAccountId(account.identifier!);

    expect(found).not.toBeNull();
    expect(found?.getOwnedQuantity(stock1.identifier!)).toBe(10);
    expect(found?.getOwnedQuantity(stock2.identifier!)).toBe(5);
  });

  test('save - should replace items when updating', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    let portfolio = Portfolio.create(account);
    portfolio = portfolio.addStock(stock, 10) as Portfolio;
    await repository.save(portfolio);

    portfolio = portfolio.removeStock(stock, 5) as Portfolio;
    await repository.save(portfolio);

    const found = await repository.findByAccountId(account.identifier!);

    expect(found).not.toBeNull();
    expect(found?.getOwnedQuantity(stock.identifier!)).toBe(5);
  });

  test('findAllByStockId - should not return portfolios with zero quantity', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    let portfolio = Portfolio.create(account);
    portfolio = portfolio.addStock(stock, 10) as Portfolio;
    portfolio = portfolio.removeStock(stock, 10) as Portfolio;
    await repository.save(portfolio);

    const portfolios = await repository.findAllByStockId(stock.identifier!);

    const hasPortfolio = portfolios.some(p => p.account.identifier === account.identifier);
    expect(hasPortfolio).toBe(false);
  });
});
