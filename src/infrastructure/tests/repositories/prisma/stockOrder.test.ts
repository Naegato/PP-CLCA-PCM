import { PrismaStockOrderRepository } from '@pp-clca-pcm/adapters/repositories/prisma/stockOrder/stockOrder';
import { prisma } from '@pp-clca-pcm/adapters/repositories/prisma/client';
import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { beforeEach, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma StockOrder Repository', async () => {
  const repository = new PrismaStockOrderRepository(prisma);

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.transaction.deleteMany(),
      prisma.portfolioItem.deleteMany(),
      prisma.portfolio.deleteMany(),
      prisma.stockOrder.deleteMany(),
      prisma.stock.deleteMany(),
      prisma.account.deleteMany(),
      prisma.accountType.deleteMany(),
      prisma.company.deleteMany(),
      prisma.ban.deleteMany(),
      prisma.notification.deleteMany(),
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
    const created = await prisma.accountType.create({
      data: {
        name: accountType.name,
        rate: accountType.rate,
        limitByClient: accountType.limitByClient,
        description: accountType.description,
      },
    });
    return AccountType.createFromRaw(
      created.identifier,
      created.name,
      created.rate,
      created.limitByClient,
      created.description
    );
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

  test('save - should save a new order', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    const saved = await repository.save(order);

    expect(saved.identifier).toBeDefined();
    expect(saved.side).toBe(OrderSide.BUY);
    expect(saved.price).toBe(100);
    expect(saved.quantity).toBe(10);
  });

  test('save - should update existing order', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    await repository.save(order);

    const updated = order.reduceRemainingBy(5);
    await repository.save(updated);

    const found = await repository.findById(order.identifier!);

    expect(found).not.toBeNull();
    expect(found?.remainingQuantity).toBe(5);
  });

  test('findOpenBuyOrders - should find open buy orders', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    await repository.save(StockOrder.create(stock, account, OrderSide.BUY, 100, 10));
    await repository.save(StockOrder.create(stock, account, OrderSide.SELL, 100, 10));

    const buyOrders = await repository.findOpenBuyOrders(stock.identifier!);

    expect(buyOrders.length).toBeGreaterThanOrEqual(1);
    expect(buyOrders.every(o => o.side === OrderSide.BUY)).toBe(true);
  });

  test('findOpenSellOrders - should find open sell orders', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    await repository.save(StockOrder.create(stock, account, OrderSide.SELL, 100, 10));

    const sellOrders = await repository.findOpenSellOrders(stock.identifier!);

    expect(sellOrders.length).toBeGreaterThanOrEqual(1);
    expect(sellOrders.every(o => o.side === OrderSide.SELL)).toBe(true);
  });

  test('getCommittedSellQuantity - should calculate committed sell quantity', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    await repository.save(StockOrder.create(stock, account, OrderSide.SELL, 100, 10));
    await repository.save(StockOrder.create(stock, account, OrderSide.SELL, 100, 5));

    const committed = await repository.getCommittedSellQuantity(account.identifier!, stock.identifier!);

    expect(committed).toBe(15);
  });

  test('findById - should find order by id', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    await repository.save(order);

    const found = await repository.findById(order.identifier!);

    expect(found).not.toBeNull();
    expect(found?.identifier).toBe(order.identifier);
  });

  test('findAllByOwnerId - should find orders by owner', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    await repository.save(StockOrder.create(stock, account, OrderSide.BUY, 100, 10));
    await repository.save(StockOrder.create(stock, account, OrderSide.SELL, 100, 5));

    const orders = await repository.findAllByOwnerId(user.identifier!);

    expect(orders.length).toBeGreaterThanOrEqual(2);
  });

  test('delete - should delete order', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    await repository.save(order);

    await repository.delete(order.identifier!);

    const found = await repository.findById(order.identifier!);

    expect(found).toBeNull();
  });

  test('deleteMany - should delete multiple orders', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    const order1 = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    const order2 = StockOrder.create(stock, account, OrderSide.SELL, 100, 5);
    await repository.save(order1);
    await repository.save(order2);

    await repository.deleteMany([order1.identifier!, order2.identifier!]);

    const found1 = await repository.findById(order1.identifier!);
    const found2 = await repository.findById(order2.identifier!);

    expect(found1).toBeNull();
    expect(found2).toBeNull();
  });

  test('findAllByStockId - should find orders for a stock', async () => {
    const user = await createTestUser();
    const accountType = await createTestAccountType();
    const account = await createTestAccount(user, accountType);
    const company = await createTestCompany();
    const stock = await createTestStock(company);

    await repository.save(StockOrder.create(stock, account, OrderSide.BUY, 100, 10));
    await repository.save(StockOrder.create(stock, account, OrderSide.SELL, 100, 5));

    const orders = await repository.findAllByStockId(stock.identifier!);

    expect(orders.length).toBeGreaterThanOrEqual(2);
  });
});
