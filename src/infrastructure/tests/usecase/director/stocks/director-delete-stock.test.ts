import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { Portfolio } from '@pp-clca-pcm/domain/entities/portfolio/portfolio';
import { StockOrder, OrderSide } from '@pp-clca-pcm/domain/entities/stockOrder';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { InMemoryStockRepository } from '@pp-clca-pcm/adapters/repositories/memory/stock/stock';
import { InMemoryStockOrderRepository } from '@pp-clca-pcm/adapters/repositories/memory/stockOrder/stockOrder';
import { InMemoryPortfolioRepository } from '@pp-clca-pcm/adapters/repositories/memory/portfolio/portfolio';
import { DirectorDeleteStock } from '@pp-clca-pcm/application/usecases/director/stocks/director-delete-stock';
import { DirectorDeleteStockError } from '@pp-clca-pcm/application/errors/director-delete-stock';

describe('Director Delete Stock', () => {
  const getData = () => {
    const stockRepository = new InMemoryStockRepository();
    const portfolioRepository = new InMemoryPortfolioRepository();
    const stockOrderRepository = new InMemoryStockOrderRepository();
    const useCase = new DirectorDeleteStock(stockRepository, portfolioRepository, stockOrderRepository);

    return {
      useCase,
      stockRepository,
      portfolioRepository,
      stockOrderRepository,
    };
  };

  const createTestCompany = () => {
    return Company.create('Test Company');
  };

  const createTestStock = async (stockRepository: InMemoryStockRepository, company: Company) => {
    const stock = Stock.create('AAPL', 'Apple Inc', company);
    await stockRepository.save(stock);
    return stock;
  };

  const createTestAccount = () => {
    const user = User.fromPrimitives({
      identifier: 'user-id',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@test.com',
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });

    const accountType = AccountType.create('DEFAULT', 0);
    const iban = Iban.generate('30001', '00001', '00000000001');
    if (iban instanceof Error) throw iban;

    return Account.create(user, accountType, iban, 'Test Account');
  };

  test('Should delete stock successfully', async () => {
    const { useCase, stockRepository } = getData();
    const company = createTestCompany();
    const stock = await createTestStock(stockRepository, company);

    expect(stockRepository.stocks).toHaveLength(1);

    const result = await useCase.execute(stock.identifier!);

    expect(result).toBeUndefined();
    expect(stockRepository.stocks).toHaveLength(0);
  });

  test('Should return error when stock not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('non-existent-id');

    expect(result).instanceof(DirectorDeleteStockError);
  });

  test('Should return error when stock has open orders', async () => {
    const { useCase, stockRepository, stockOrderRepository } = getData();
    const company = createTestCompany();
    const stock = await createTestStock(stockRepository, company);
    const account = createTestAccount();

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    await stockOrderRepository.save(order);

    const result = await useCase.execute(stock.identifier!);

    expect(result).instanceof(DirectorDeleteStockError);
    expect(stockRepository.stocks).toHaveLength(1);
  });

  test('Should return error when stock is held in portfolios', async () => {
    const { useCase, stockRepository, portfolioRepository } = getData();
    const company = createTestCompany();
    const stock = await createTestStock(stockRepository, company);
    const account = createTestAccount();

    const portfolio = Portfolio.create(account);
    const updatedPortfolio = portfolio.addStock(stock, 10);
    if (updatedPortfolio instanceof Error) throw updatedPortfolio;
    await portfolioRepository.save(updatedPortfolio);

    const result = await useCase.execute(stock.identifier!);

    expect(result).instanceof(DirectorDeleteStockError);
    expect(stockRepository.stocks).toHaveLength(1);
  });

  test('Should delete stock after orders are removed', async () => {
    const { useCase, stockRepository, stockOrderRepository } = getData();
    const company = createTestCompany();
    const stock = await createTestStock(stockRepository, company);
    const account = createTestAccount();

    const order = StockOrder.create(stock, account, OrderSide.BUY, 100, 10);
    await stockOrderRepository.save(order);

    await stockOrderRepository.delete(order.identifier!);

    const result = await useCase.execute(stock.identifier!);

    expect(result).toBeUndefined();
    expect(stockRepository.stocks).toHaveLength(0);
  });
});
