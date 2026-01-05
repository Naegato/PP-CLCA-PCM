import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { InMemoryCompanyRepository } from '@pp-clca-pcm/adapters/repositories/memory/company';
import { InMemoryStockRepository } from '@pp-clca-pcm/adapters/repositories/memory/stock/stock';
import { DirectorCreateStock } from '@pp-clca-pcm/application/usecases/director/stocks/director-create-stock';
import { DirectorCreateStockError } from '@pp-clca-pcm/application/errors/director-create-stock';

describe('Director Create Stock', () => {
  const getData = () => {
    const stockRepository = new InMemoryStockRepository();
    const companyRepository = new InMemoryCompanyRepository();
    const useCase = new DirectorCreateStock(stockRepository, companyRepository);

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

  test('Should create stock successfully', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);

    const result = await useCase.execute('AAPL', 'Apple Inc', company.identifier);

    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBeInstanceOf(Stock);

    const stock = result as Stock;
    expect(stock.symbol).toBe('AAPL');
    expect(stock.name).toBe('Apple Inc');
    expect(stock.company.identifier).toBe(company.identifier);
    expect(stock.isListed).toBe(true);
    expect(stock.identifier).toBeDefined();

    expect(stockRepository.stocks).toHaveLength(1);
  });

  test('Should return error when symbol already exists', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);

    const existingStock = Stock.create('AAPL', 'Apple Inc', company);
    await stockRepository.save(existingStock);

    const result = await useCase.execute('AAPL', 'Another Apple', company.identifier);

    expect(result).toBeInstanceOf(DirectorCreateStockError);
  });

  test('Should return error when company not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('AAPL', 'Apple Inc', 'non-existent-company-id');

    expect(result).toBeInstanceOf(DirectorCreateStockError);
  });

  test('Should uppercase symbol automatically', async () => {
    const { useCase, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);

    const result = await useCase.execute('aapl', 'Apple Inc', company.identifier);

    expect(result).toBeInstanceOf(Stock);
    const stock = result as Stock;
    expect(stock.symbol).toBe('AAPL');
  });

  test('Should create multiple stocks for same company', async () => {
    const { useCase, stockRepository, companyRepository } = getData();
    const company = await createTestCompany(companyRepository);

    const result1 = await useCase.execute('AAPL', 'Apple Inc', company.identifier);
    const result2 = await useCase.execute('MSFT', 'Microsoft', company.identifier);

    expect(result1).toBeInstanceOf(Stock);
    expect(result2).toBeInstanceOf(Stock);
    expect(stockRepository.stocks).toHaveLength(2);
  });
});
