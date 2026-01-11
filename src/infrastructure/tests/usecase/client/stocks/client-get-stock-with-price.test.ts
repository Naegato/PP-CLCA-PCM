import { describe, expect, test } from 'vitest';

import { Stock } from '@pp-clca-pcm/domain';
import { Company } from '@pp-clca-pcm/domain';
import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { StockOrder, OrderSide } from '@pp-clca-pcm/domain';
import { InMemoryStockRepository } from '@pp-clca-pcm/adapters';
import { InMemoryStockOrderRepository } from '@pp-clca-pcm/adapters';
import { MarketService } from '@pp-clca-pcm/application';
import { ClientGetStockWithPrice } from '@pp-clca-pcm/application';
import { ClientGetStockWithPriceError } from '@pp-clca-pcm/application';

describe('Client Get Stock With Price', () => {
  const getData = () => {
    const stockRepository = new InMemoryStockRepository();
    const stockOrderRepository = new InMemoryStockOrderRepository();
    const marketService = new MarketService(stockOrderRepository);
    const useCase = new ClientGetStockWithPrice(stockRepository, marketService);

    return {
      useCase,
      stockRepository,
      stockOrderRepository,
    };
  };

  const createTestCompany = (name: string = 'Test Company') => {
    return Company.create(name);
  };

  const createTestStock = (symbol: string, name: string, company: Company) => {
    return Stock.create(symbol, name, company);
  };

  let accountCounter = 0;
  const createTestAccount = async (id: string) => {
    accountCounter++;
    const user = User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `${id}@test.com`,
      password: 'password',
      clientProps: new ClientProps(),
    });
    const accountType = AccountType.create('DEFAULT', 0, 'Default');
    const accountNumber = accountCounter.toString().padStart(11, '0');
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;
    return Account.create(user, accountType, iban, 'Test');
  };

  test('Should return stock with price when stock exists', async () => {
    const { useCase, stockRepository } = getData();

    const company = createTestCompany('Apple Inc.');
    const stock = createTestStock('AAPL', 'Apple Stock', company);
    await stockRepository.save(stock);

    const result = await useCase.execute(stock.identifier!);

    expect(result).toBeDefined();
    expect(result.identifier).toBe(stock.identifier);
    expect(result.symbol).toBe('AAPL');
    expect(result.name).toBe('Apple Stock');
    expect(result.isListed).toBe(true);
    expect(typeof result.price).toBe('number');
  });

  test('Should throw ClientGetStockWithPriceError when stock not found', async () => {
    const { useCase } = getData();

    const data = await useCase.execute('non-existent-id');

    expect(data).instanceof(ClientGetStockWithPriceError);
  });

  test('Should return price of 0 when no orders exist', async () => {
    const { useCase, stockRepository } = getData();

    const company = createTestCompany();
    const stock = createTestStock('TEST', 'Test Stock', company);
    await stockRepository.save(stock);

    const result = await useCase.execute(stock.identifier!);

    expect(result.price).toBe(0);
  });

  test('Should calculate price from buy orders only', async () => {
    const { useCase, stockRepository, stockOrderRepository } = getData();

    const company = createTestCompany();
    const stock = createTestStock('TEST', 'Test Stock', company);
    await stockRepository.save(stock);

    const account1 = await createTestAccount('owner-1');
    const account2 = await createTestAccount('owner-2');

    // Create buy orders: StockOrder.create(stock, account, side, price, quantity)
    const buyOrder1 = StockOrder.create(stock, account1, OrderSide.BUY, 100, 10);
    const buyOrder2 = StockOrder.create(stock, account2, OrderSide.BUY, 120, 10);
    await stockOrderRepository.save(buyOrder1);
    await stockOrderRepository.save(buyOrder2);

    const result = await useCase.execute(stock.identifier!);

    // With only buy orders, price should be the highest buy price
    expect(result.price).toBe(120);
  });

  test('Should calculate price from sell orders only', async () => {
    const { useCase, stockRepository, stockOrderRepository } = getData();

    const company = createTestCompany();
    const stock = createTestStock('TEST', 'Test Stock', company);
    await stockRepository.save(stock);

    const account1 = await createTestAccount('owner-1');
    const account2 = await createTestAccount('owner-2');

    // Create sell orders
    const sellOrder1 = StockOrder.create(stock, account1, OrderSide.SELL, 150, 10);
    const sellOrder2 = StockOrder.create(stock, account2, OrderSide.SELL, 130, 10);
    await stockOrderRepository.save(sellOrder1);
    await stockOrderRepository.save(sellOrder2);

    const result = await useCase.execute(stock.identifier!);

    // With only sell orders, price should be the lowest sell price
    expect(result.price).toBe(130);
  });

  test('Should calculate average price from buy and sell orders', async () => {
    const { useCase, stockRepository, stockOrderRepository } = getData();

    const company = createTestCompany();
    const stock = createTestStock('TEST', 'Test Stock', company);
    await stockRepository.save(stock);

    const account1 = await createTestAccount('owner-1');
    const account2 = await createTestAccount('owner-2');

    // Create buy order at 100
    const buyOrder = StockOrder.create(stock, account1, OrderSide.BUY, 100, 10);
    // Create sell order at 120
    const sellOrder = StockOrder.create(stock, account2, OrderSide.SELL, 120, 10);

    await stockOrderRepository.save(buyOrder);
    await stockOrderRepository.save(sellOrder);

    const result = await useCase.execute(stock.identifier!);

    // Price should be average of highest buy (100) and lowest sell (120)
    expect(result.price).toBe(110);
  });

  test('Should include all stock properties in response', async () => {
    const { useCase, stockRepository } = getData();

    const company = createTestCompany('Tech Corp');
    const stock = createTestStock('TECH', 'Technology Stock', company);
    await stockRepository.save(stock);

    const result = await useCase.execute(stock.identifier!);

    expect(result.identifier).toBe(stock.identifier);
    expect(result.symbol).toBe('TECH');
    expect(result.name).toBe('Technology Stock');
    expect(result.isListed).toBe(true);
    expect(result.createdAt).instanceof(Date);
    expect(typeof result.price).toBe('number');
  });
});
