import { describe, expect, test } from 'vitest';

import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { InMemoryStockOrderRepository } from '@pp-clca-pcm/adapters/repositories/memory/stockOrder/stockOrder';
import { ClientGetStockOrders } from '@pp-clca-pcm/application/usecases/client/stocks-orders/client-get-stock-orders';
import { ClientGetStockOrdersError } from '@pp-clca-pcm/application/errors/client-get-stock-orders';

describe('Client Get Stock Orders', () => {
  const getData = () => {
    const stockOrderRepository = new InMemoryStockOrderRepository();
    const useCase = new ClientGetStockOrders(stockOrderRepository);

    return {
      useCase,
      stockOrderRepository,
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

  const createTestAccount = async (owner: User, accountNumber: string) => {
    const accountType = AccountType.create('DEFAULT', 0, 'Default account');
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;
    return Account.create(owner, accountType, iban, 'Test Account');
  };

  const createTestStock = () => {
    const company = Company.create('Test Company');
    return Stock.create('TEST', 'Test Stock', company);
  };

  test('Should return empty array when user has no orders', async () => {
    const { useCase } = getData();

    const user = createTestUser();

    const result = await useCase.execute(user);

    expect(result).not.toBeInstanceOf(ClientGetStockOrdersError);
    expect(result).toEqual([]);
  });

  test('Should return all orders for user', async () => {
    const { useCase, stockOrderRepository } = getData();

    const user = createTestUser();
    const account = await createTestAccount(user, '00000000001');
    const stock = createTestStock();

    const order1 = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    const order2 = StockOrder.create(stock, account, OrderSide.SELL, 110, 5);

    await stockOrderRepository.save(order1);
    await stockOrderRepository.save(order2);

    const result = await useCase.execute(user);

    expect(result).not.toBeInstanceOf(ClientGetStockOrdersError);
    expect(result).toHaveLength(2);
  });

  test('Should return only orders belonging to the user', async () => {
    const { useCase, stockOrderRepository } = getData();

    const user1 = createTestUser('user-1');
    const user2 = createTestUser('user-2');
    const account1 = await createTestAccount(user1, '00000000001');
    const account2 = await createTestAccount(user2, '00000000002');
    const stock = createTestStock();

    const order1 = StockOrder.create(stock, account1, OrderSide.BUY, 100, 10);
    const order2 = StockOrder.create(stock, account2, OrderSide.BUY, 100, 10);
    const order3 = StockOrder.create(stock, account1, OrderSide.SELL, 110, 5);

    await stockOrderRepository.save(order1);
    await stockOrderRepository.save(order2);
    await stockOrderRepository.save(order3);

    const result = await useCase.execute(user1);

    expect(result).not.toBeInstanceOf(ClientGetStockOrdersError);
    expect(result).toHaveLength(2);
    expect((result as StockOrder[]).every(o => o.account.owner.identifier === 'user-1')).toBe(true);
  });

  test('Should return ClientGetStockOrdersError when user has no identifier', async () => {
    const { useCase } = getData();

    const userWithoutId = User.fromPrimitives({
      identifier: null as any,
      firstname: 'John',
      lastname: 'Doe',
      email: 'test@yopmail.com',
      password: 'hashedPassword123',
      clientProps: new ClientProps(),
    });

    const result = await useCase.execute(userWithoutId);

    expect(result).toBeInstanceOf(ClientGetStockOrdersError);
  });

  test('Should return orders with correct properties', async () => {
    const { useCase, stockOrderRepository } = getData();

    const user = createTestUser();
    const account = await createTestAccount(user, '00000000001');
    const stock = createTestStock();

    const order = StockOrder.create(stock, account, OrderSide.BUY, 150, 20);
    await stockOrderRepository.save(order);

    const result = await useCase.execute(user);

    expect(result).toHaveLength(1);
    const fetchedOrder = (result as StockOrder[])[0];
    expect(fetchedOrder.price).toBe(150);
    expect(fetchedOrder.quantity).toBe(20);
    expect(fetchedOrder.side).toBe(OrderSide.BUY);
    expect(fetchedOrder.stock.symbol).toBe('TEST');
  });
});
