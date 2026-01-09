import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain';
import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { Stock } from '@pp-clca-pcm/domain';
import { Company } from '@pp-clca-pcm/domain';
import { StockOrder, OrderSide } from '@pp-clca-pcm/domain';
import { Transaction } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters';
import { InMemoryStockRepository } from '@pp-clca-pcm/adapters';
import { InMemoryStockOrderRepository } from '@pp-clca-pcm/adapters';
import { InMemoryPortfolioRepository } from '@pp-clca-pcm/adapters';
import { ClientMatchStockOrder } from '@pp-clca-pcm/application';
import { MatchStockOrderError } from '@pp-clca-pcm/application';

describe('Client Match Stock Order', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);
    const stockRepository = new InMemoryStockRepository();
    const stockOrderRepository = new InMemoryStockOrderRepository();
    const portfolioRepository = new InMemoryPortfolioRepository();

    const useCase = new ClientMatchStockOrder(
      stockOrderRepository,
      accountRepository,
      portfolioRepository,
    );

    return {
      useCase,
      userRepository,
      accountRepository,
      stockRepository,
      stockOrderRepository,
      portfolioRepository,
    };
  };

  const createTestUser = (email: string) => {
    return User.fromPrimitives({
      identifier: `user-${email}`,
      firstname: 'Test',
      lastname: 'User',
      email,
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });
  };

  const createTestAccount = async (
    user: User,
    accountRepository: InMemoryAccountRepository,
    balance: number,
    accountNumber: string,
  ) => {
    const accountType = AccountType.create('DEFAULT', 0);
    const iban = Iban.generate('30001', '00001', accountNumber);
    if (iban instanceof Error) throw iban;

    let account = Account.create(user, accountType, iban, 'Test Account');

    if (balance > 0) {
      const deposit = Transaction.create(account, balance, 'Initial deposit');
      account = account.update({
        receivedTransactions: [deposit],
      });
    }

    await accountRepository.save(account);
    return account;
  };

  const createTestStock = async (stockRepository: InMemoryStockRepository) => {
    const company = Company.create('Test Company');
    const stock = Stock.create('AAPL', 'Apple Inc', company);
    await stockRepository.save(stock);
    return stock;
  };

  test('Should return 0 when no matching orders exist', async () => {
    const { useCase, accountRepository, stockRepository, userRepository } = getData();

    const buyer = createTestUser('buyer@test.com');
    await userRepository.save(buyer);

    const buyerAccount = await createTestAccount(buyer, accountRepository, 10000, '00000000001');
    const stock = await createTestStock(stockRepository);

    const buyOrder = StockOrder.create(stock, buyerAccount, OrderSide.BUY, 100, 10);

    const result = await useCase.execute(buyOrder);

    expect(result).toBe(0);
  });

  test('Should return error when order stock has no identifier', async () => {
    const { useCase, accountRepository, userRepository } = getData();

    const buyer = createTestUser('buyer@test.com');
    await userRepository.save(buyer);

    const buyerAccount = await createTestAccount(buyer, accountRepository, 10000, '00000000001');

    const company = Company.create('Test Company');
    const stockWithoutId = Stock.create('AAPL', 'Apple Inc', company);
    const modifiedStock = Object.assign(Object.create(Object.getPrototypeOf(stockWithoutId)), stockWithoutId, { identifier: null });

    const buyOrder = StockOrder.create(modifiedStock, buyerAccount, OrderSide.BUY, 100, 10);

    const result = await useCase.execute(buyOrder);

    expect(result).instanceof(MatchStockOrderError);
  });

  test('Should return 0 when sell order exists but no buy orders', async () => {
    const { useCase, accountRepository, stockRepository, stockOrderRepository, userRepository } = getData();

    const seller = createTestUser('seller@test.com');
    await userRepository.save(seller);

    const sellerAccount = await createTestAccount(seller, accountRepository, 1000, '00000000001');
    const stock = await createTestStock(stockRepository);

    // Create a sell order
    const sellOrder = StockOrder.create(stock, sellerAccount, OrderSide.SELL, 100, 10);

    const result = await useCase.execute(sellOrder);

    expect(result).toBe(0);
  });

  test('Should return error when buyer has no account identifier', async () => {
    const { useCase, stockRepository, stockOrderRepository, userRepository } = getData();

    const buyer = createTestUser('buyer@test.com');
    const seller = createTestUser('seller@test.com');
    await userRepository.save(buyer);
    await userRepository.save(seller);

    const stock = await createTestStock(stockRepository);

    const accountType = AccountType.create('DEFAULT', 0);
    const iban = Iban.generate('30001', '00001', '00000000001');
    if (iban instanceof Error) throw iban;

    // Create account without identifier
    const buyerAccount = Account.create(buyer, accountType, iban, 'Test Account');
    const accountWithoutId = Object.assign(Object.create(Object.getPrototypeOf(buyerAccount)), buyerAccount, { identifier: null });

    const sellerIban = Iban.generate('30001', '00001', '00000000002');
    if (sellerIban instanceof Error) throw sellerIban;
    const sellerAccount = Account.create(seller, accountType, sellerIban, 'Seller Account');

    // Create sell order
    const sellOrder = StockOrder.create(stock, sellerAccount, OrderSide.SELL, 100, 10);
    await stockOrderRepository.save(sellOrder);

    // Create buy order with account without id
    const buyOrder = StockOrder.create(stock, accountWithoutId, OrderSide.BUY, 100, 10);

    const result = await useCase.execute(buyOrder);

    expect(result).instanceof(MatchStockOrderError);
  });

  test('Should find opposite sell orders when executing buy order', async () => {
    const { useCase, accountRepository, stockRepository, stockOrderRepository, userRepository } = getData();

    const buyer = createTestUser('buyer@test.com');
    const seller = createTestUser('seller@test.com');
    await userRepository.save(buyer);
    await userRepository.save(seller);

    const buyerAccount = await createTestAccount(buyer, accountRepository, 100, '00000000001');
    const sellerAccount = await createTestAccount(seller, accountRepository, 1000, '00000000002');

    const stock = await createTestStock(stockRepository);

    // Create a sell order at price 100
    const sellOrder = StockOrder.create(stock, sellerAccount, OrderSide.SELL, 100, 10);
    await stockOrderRepository.save(sellOrder);

    // Create a buy order at price 100 - buyer has insufficient funds (100 < 100*10 + fee)
    const buyOrder = StockOrder.create(stock, buyerAccount, OrderSide.BUY, 100, 10);

    const result = await useCase.execute(buyOrder);

    // Should return error due to insufficient funds
    expect(result).instanceof(MatchStockOrderError);
  });
});
