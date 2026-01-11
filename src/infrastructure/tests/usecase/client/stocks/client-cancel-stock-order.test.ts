import { InMemoryUserRepository, JwtSecurityService, JwtTokenService } from '@pp-clca-pcm/adapters';
import { describe, expect, test } from 'vitest';

import { Email, Password, Stock } from '@pp-clca-pcm/domain';
import { Company } from '@pp-clca-pcm/domain';
import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { StockOrder, OrderSide } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { InMemoryStockOrderRepository } from '@pp-clca-pcm/adapters';
import { ClientCancelStockOrder } from '@pp-clca-pcm/application';
import { ClientCancelStockOrderError } from '@pp-clca-pcm/application';

describe('Client Cancel Stock Order', () => {
  const getData = () => {
    const stockOrderRepository = new InMemoryStockOrderRepository();
    const tokenService = new JwtTokenService();
    const userRepository = new InMemoryUserRepository();
    const security = new JwtSecurityService(tokenService, userRepository);
    const useCase = new ClientCancelStockOrder(stockOrderRepository, security);

    return {
      useCase,
      stockOrderRepository,
    };
  };

  const createTestUser = (id: string = 'user-123') => {
    const email = Email.create(`${id}@yopmail.com`)
    const password = Password.create('hashedPassword123&');

    if (email instanceof Error) {
      expect.fail('Email creation failed');
    }

    if (password instanceof Error) {
      expect.fail('Password creation failed');
    }

    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: email,
      password: password,
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

  test('Should cancel order successfully', async () => {
    const { useCase, stockOrderRepository } = getData();

    const user = createTestUser();
    if (user instanceof Error) {
      expect.fail('User creation failed');
    }
    const account = await createTestAccount(user, '00000000001');
    const stock = createTestStock();

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    await stockOrderRepository.save(order);

    const result = await useCase.execute(order.identifier!);

    expect(result).toBeUndefined();

    const deletedOrder = await stockOrderRepository.findById(order.identifier!);
    expect(deletedOrder).toBeNull();
  });

  test('Should return error when order not found', async () => {
    const { useCase } = getData();

    const user = createTestUser();

    const result = await useCase.execute('non-existent-order');

    expect(result).instanceof(ClientCancelStockOrderError);
    expect((result as ClientCancelStockOrderError).message).toContain('not found');
  });

  test('Should return error when user is not the owner', async () => {
    const { useCase, stockOrderRepository } = getData();

    const owner = createTestUser('owner');
    if (owner instanceof Error) {
      expect.fail('Owner creation failed');
    }
    const otherUser = createTestUser('other');
    const account = await createTestAccount(owner, '00000000001');
    const stock = createTestStock();

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    await stockOrderRepository.save(order);

    const result = await useCase.execute(order.identifier!);

    expect(result).instanceof(ClientCancelStockOrderError);
    expect((result as ClientCancelStockOrderError).message).toContain('not the owner');
  });

  test('Should return error when order is already executed', async () => {
    const { useCase, stockOrderRepository } = getData();

    const user = createTestUser();
    if (user instanceof Error) {
      expect.fail('User creation failed');
    }
    const account = await createTestAccount(user, '00000000001');
    const stock = createTestStock();

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    // Reduce remaining to 0 to mark as executed
    const executedOrder = order.reduceRemainingBy(10);
    await stockOrderRepository.save(executedOrder);

    const result = await useCase.execute(executedOrder.identifier!);

    expect(result).instanceof(ClientCancelStockOrderError);
    expect((result as ClientCancelStockOrderError).message).toContain('already executed');
  });

  test('Should return error when user has no identifier', async () => {
    const { useCase, stockOrderRepository } = getData();

    const owner = createTestUser();
    if (owner instanceof Error) {
      expect.fail('Owner creation failed');
    }
    const account = await createTestAccount(owner, '00000000001');
    const stock = createTestStock();

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    await stockOrderRepository.save(order);

    const email = Email.create('test@yopmail.com');
    const password = Password.create('hashedPasword123&');
    if (email instanceof Error) {
      expect.fail('Email creation failed');
    }
    if (password instanceof Error) {
      expect.fail('Password creation failed');
    }

    const userWithoutId = User.fromPrimitives({
      identifier: null as any,
      firstname: 'John',
      lastname: 'Doe',
      email: email,
      password: password,
      clientProps: new ClientProps(),
    });

    const result = await useCase.execute(order.identifier!);

    expect(result).instanceof(ClientCancelStockOrderError);
  });

  test('Should keep other orders when cancelling one', async () => {
    const { useCase, stockOrderRepository } = getData();

    const user = createTestUser();
    const account = await createTestAccount(user, '00000000001');
    const stock = createTestStock();

    const order1 = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    const order2 = StockOrder.create(stock, account, OrderSide.BUY, 110, 5);
    await stockOrderRepository.save(order1);
    await stockOrderRepository.save(order2);

    await useCase.execute(order1.identifier!);

    const remainingOrders = await stockOrderRepository.findAllByOwnerId(user.identifier!);
    expect(remainingOrders).toHaveLength(1);
    expect(remainingOrders[0].identifier).toBe(order2.identifier);
  });
});
