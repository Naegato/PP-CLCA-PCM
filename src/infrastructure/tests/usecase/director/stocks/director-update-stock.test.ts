import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { InMemoryCompanyRepository } from '@pp-clca-pcm/adapters/repositories/memory/company';
import { InMemoryStockRepository } from '@pp-clca-pcm/adapters/repositories/memory/stock/stock';
import { DirectorUpdateStock } from '@pp-clca-pcm/application/usecases/director/stocks/director-update-stock';
import { DirectorUpdateStockError } from '@pp-clca-pcm/application/errors/director-update-stock';

describe('Director Update Stock', () => {
  const getData = () => {
    const stockRepository = new InMemoryStockRepository();
    const companyRepository = new InMemoryCompanyRepository();
    const useCase = new DirectorUpdateStock(stockRepository, companyRepository);

    return {
      useCase,
      stockRepository,
      companyRepository,
    };
  };

  const createTestCompany = async (companyRepository: InMemoryCompanyRepository, name: string = 'Test Company') => {
    const company = Company.create(name);
    await companyRepository.create(company);
    return company;
  };

  const createTestStock = async (
    stockRepository: InMemoryStockRepository,
    company: Company,
    symbol: string = 'AAPL',
    name: string = 'Apple Inc'
  ) => {
    const stock = Stock.create(symbol, name, company);
    await stockRepository.save(stock);
    return stock;
  };

  test('Should update stock name', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);
    const stock = await createTestStock(stockRepository, company);

    const result = await useCase.execute(stock.identifier!, 'New Apple Name');

    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBeInstanceOf(Stock);

    const updatedStock = result as Stock;
    expect(updatedStock.name).toBe('New Apple Name');
    expect(updatedStock.symbol).toBe('AAPL');
  });

  test('Should update stock symbol', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);
    const stock = await createTestStock(stockRepository, company);

    const result = await useCase.execute(stock.identifier!, undefined, 'APPL');

    expect(result).toBeInstanceOf(Stock);
    const updatedStock = result as Stock;
    expect(updatedStock.symbol).toBe('APPL');
  });

  test('Should update stock listing status', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);
    const stock = await createTestStock(stockRepository, company);

    expect(stock.isListed).toBe(true);

    const result = await useCase.execute(stock.identifier!, undefined, undefined, false);

    expect(result).toBeInstanceOf(Stock);
    const updatedStock = result as Stock;
    expect(updatedStock.isListed).toBe(false);
  });

  test('Should update stock company', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company1 = await createTestCompany(companyRepository, 'Company 1');
    const company2 = await createTestCompany(companyRepository, 'Company 2');
    const stock = await createTestStock(stockRepository, company1);

    const result = await useCase.execute(stock.identifier!, undefined, undefined, undefined, company2.identifier);

    expect(result).toBeInstanceOf(Stock);
    const updatedStock = result as Stock;
    expect(updatedStock.company.identifier).toBe(company2.identifier);
  });

  test('Should return error when stock not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('non-existent-id', 'New Name');

    expect(result).toBeInstanceOf(DirectorUpdateStockError);
  });

  test('Should return error when new symbol already exists', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);
    const stock1 = await createTestStock(stockRepository, company, 'AAPL', 'Apple');
    await createTestStock(stockRepository, company, 'MSFT', 'Microsoft');

    const result = await useCase.execute(stock1.identifier!, undefined, 'MSFT');

    expect(result).toBeInstanceOf(DirectorUpdateStockError);
  });

  test('Should return error when new company not found', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);
    const stock = await createTestStock(stockRepository, company);

    const result = await useCase.execute(stock.identifier!, undefined, undefined, undefined, 'non-existent-company-id');

    expect(result).toBeInstanceOf(DirectorUpdateStockError);
  });

  test('Should allow updating to same symbol (no change)', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);
    const stock = await createTestStock(stockRepository, company, 'AAPL');

    const result = await useCase.execute(stock.identifier!, undefined, 'AAPL');

    expect(result).toBeInstanceOf(Stock);
    const updatedStock = result as Stock;
    expect(updatedStock.symbol).toBe('AAPL');
  });

  test('Should update multiple properties at once', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company1 = await createTestCompany(companyRepository, 'Company 1');
    const company2 = await createTestCompany(companyRepository, 'Company 2');
    const stock = await createTestStock(stockRepository, company1, 'AAPL', 'Apple');

    const result = await useCase.execute(stock.identifier!, 'New Name', 'NEWSMBL', false, company2.identifier);

    expect(result).toBeInstanceOf(Stock);
    const updatedStock = result as Stock;
    expect(updatedStock.name).toBe('New Name');
    expect(updatedStock.symbol).toBe('NEWSMBL');
    expect(updatedStock.isListed).toBe(false);
    expect(updatedStock.company.identifier).toBe(company2.identifier);
  });
});
