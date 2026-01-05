import { describe, expect, test } from 'vitest';

import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { BANK_ATTRIBUTES, TRADING_FEE } from '@pp-clca-pcm/domain/constants/bank';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters/repositories/memory/account/account';
import { InMemoryStockRepository } from '@pp-clca-pcm/adapters/repositories/memory/stock/stock';
import { InMemoryStockOrderRepository } from '@pp-clca-pcm/adapters/repositories/memory/stockOrder/stockOrder';
import { InMemoryPortfolioRepository } from '@pp-clca-pcm/adapters/repositories/memory/portfolio/portfolio';
import { ClientRegisterStockOrder } from '@pp-clca-pcm/application/usecases/client/stocks-orders/client-register-stock-order';
import { ClientMatchStockOrder } from '@pp-clca-pcm/application/usecases/client/stocks-orders/client-match-stock-order';
import { ClientRegisterStockOrderError } from '@pp-clca-pcm/application/errors/client-register-stock-order';

describe('Client Register Stock Order', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);
    const stockRepository = new InMemoryStockRepository();
    const stockOrderRepository = new InMemoryStockOrderRepository();
    const portfolioRepository = new InMemoryPortfolioRepository();

    const matchStockOrder = new ClientMatchStockOrder(
      stockOrderRepository,
      accountRepository,
      portfolioRepository
    );

    const useCase = new ClientRegisterStockOrder(
      stockOrderRepository,
      stockRepository,
      matchStockOrder
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

  const createTestUser = (id: string = 'user-123') => {
    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `${id}@yopmail.com`,
      password: 'hashedPassword123',
      clientProps: new ClientProps(),
    });
  };

  const createAccountWithBalance = async (
    owner: User,
    accountRepository: InMemoryAccountRepository,
    balance: number,
    accountNumber: string,
    portfolio?: Portfolio
  ) => {
    const accountType = AccountType.create('DEFAULT', 0, 'Default account');
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    let account = Account.create(owner, accountType, iban, 'Test Account');

    if (balance > 0) {
      const deposit = Transaction.create(account, balance, 'Initial deposit');
      account = account.update({
        receivedTransactions: [deposit],
      });
    }

    // Workaround to add portfolio to account (since Account.create doesn't accept portfolio)
    if (portfolio) {
      account = new (Account as any)(
        account.identifier,
        account.owner,
        account.type,
        account.emittedTransactions,
        account.receivedTransactions,
        account.iban,
        account.name,
        portfolio
      );
    }

    await accountRepository.save(account);
    return account;
  };

  const createTestStock = async (stockRepository: InMemoryStockRepository) => {
    const company = Company.create('Test Company');
    const stock = Stock.create('TEST', 'Test Stock', company);
    await stockRepository.save(stock);
    return stock;
  };

  test('Should register buy order successfully', async () => {
    const { useCase, userRepository, accountRepository, stockRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createAccountWithBalance(user, accountRepository, 1000, '00000000001');
    const stock = await createTestStock(stockRepository);

    const result = await useCase.execute(account, stock.identifier!, OrderSide.BUY, 100, 5);

    expect(result).not.instanceof(ClientRegisterStockOrderError);
    expect(result).instanceof(StockOrder);

    const order = result as StockOrder;
    expect(order.side).toBe(OrderSide.BUY);
    expect(order.price).toBe(100);
    expect(order.quantity).toBe(5);
  });

  test('Should return error when stock not found', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createAccountWithBalance(user, accountRepository, 1000, '00000000001');

    const result = await useCase.execute(account, 'non-existent-stock', OrderSide.BUY, 100, 5);

    expect(result).instanceof(ClientRegisterStockOrderError);
    expect((result as ClientRegisterStockOrderError).message).toContain('not found');
  });

  test('Should return error when quantity is zero or negative', async () => {
    const { useCase, userRepository, accountRepository, stockRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createAccountWithBalance(user, accountRepository, 1000, '00000000001');
    const stock = await createTestStock(stockRepository);

    const result = await useCase.execute(account, stock.identifier!, OrderSide.BUY, 100, 0);

    expect(result).instanceof(ClientRegisterStockOrderError);
    expect((result as ClientRegisterStockOrderError).message).toContain('positive');
  });

  test('Should return error when price is zero or negative', async () => {
    const { useCase, userRepository, accountRepository, stockRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createAccountWithBalance(user, accountRepository, 1000, '00000000001');
    const stock = await createTestStock(stockRepository);

    const result = await useCase.execute(account, stock.identifier!, OrderSide.BUY, -10, 5);

    expect(result).instanceof(ClientRegisterStockOrderError);
    expect((result as ClientRegisterStockOrderError).message).toContain('positive');
  });

  test('Should return error when insufficient balance for buy order', async () => {
    const { useCase, userRepository, accountRepository, stockRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    // Balance of 100, trying to buy 5 shares at 100 = 500 + TRADING_FEE
    const account = await createAccountWithBalance(user, accountRepository, 100, '00000000001');
    const stock = await createTestStock(stockRepository);

    const result = await useCase.execute(account, stock.identifier!, OrderSide.BUY, 100, 5);

    expect(result).instanceof(ClientRegisterStockOrderError);
    expect((result as ClientRegisterStockOrderError).message).toContain('Insufficient balance');
  });

  test('Should return error when selling without portfolio', async () => {
    const { useCase, userRepository, accountRepository, stockRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createAccountWithBalance(user, accountRepository, 1000, '00000000001');
    const stock = await createTestStock(stockRepository);

    const result = await useCase.execute(account, stock.identifier!, OrderSide.SELL, 100, 5);

    expect(result).instanceof(ClientRegisterStockOrderError);
    expect((result as ClientRegisterStockOrderError).message).toContain('portfolio');
  });

  test('Should save order to repository', async () => {
    const { useCase, userRepository, accountRepository, stockRepository, stockOrderRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createAccountWithBalance(user, accountRepository, 1000, '00000000001');
    const stock = await createTestStock(stockRepository);

    const result = await useCase.execute(account, stock.identifier!, OrderSide.BUY, 50, 10);

    expect(result).instanceof(StockOrder);

    const savedOrders = await stockOrderRepository.findAllByOwnerId(user.identifier!);
    expect(savedOrders).toHaveLength(1);
    expect(savedOrders[0].price).toBe(50);
    expect(savedOrders[0].quantity).toBe(10);
  });

  test('Should account for trading fee in buy order balance check', async () => {
    const { useCase, userRepository, accountRepository, stockRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    // Exactly enough for order (100 * 5 = 500) but not for fee
    const account = await createAccountWithBalance(user, accountRepository, 500, '00000000001');
    const stock = await createTestStock(stockRepository);

    const result = await useCase.execute(account, stock.identifier!, OrderSide.BUY, 100, 5);

    expect(result).instanceof(ClientRegisterStockOrderError);
    expect((result as ClientRegisterStockOrderError).message).toContain('Insufficient balance');
  });

  test('Should succeed when balance covers order plus trading fee', async () => {
    const { useCase, userRepository, accountRepository, stockRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    // 500 for order + TRADING_FEE for fee
    const account = await createAccountWithBalance(user, accountRepository, 500 + TRADING_FEE, '00000000001');
    const stock = await createTestStock(stockRepository);

    const result = await useCase.execute(account, stock.identifier!, OrderSide.BUY, 100, 5);

    expect(result).not.instanceof(ClientRegisterStockOrderError);
    expect(result).instanceof(StockOrder);
  });
});
