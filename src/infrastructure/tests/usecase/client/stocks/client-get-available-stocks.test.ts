import { describe, expect, test } from 'vitest';

import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { InMemoryStockRepository } from '@pp-clca-pcm/adapters/repositories/memory/stock/stock';
import { ClientGetAvailableStocks } from '@pp-clca-pcm/application/usecases/client/stocks/client-get-available-stocks';

describe('Client Get Available Stocks', () => {
  const getData = () => {
    const stockRepository = new InMemoryStockRepository();
    const useCase = new ClientGetAvailableStocks(stockRepository);

    return {
      useCase,
      stockRepository,
    };
  };

  const createTestCompany = (name: string = 'Test Company') => {
    return Company.create(name);
  };

  const createTestStock = (symbol: string, name: string, company: Company, isListed: boolean = true) => {
    const stock = Stock.create(symbol, name, company);
    if (!isListed) {
      return stock.toggleListed();
    }
    return stock;
  };

  test('Should return empty array when no stocks exist', async () => {
    const { useCase } = getData();

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  test('Should return all listed stocks', async () => {
    const { useCase, stockRepository } = getData();

    const company = createTestCompany();
    const stock1 = createTestStock('AAPL', 'Apple Inc.', company);
    const stock2 = createTestStock('GOOGL', 'Alphabet Inc.', company);

    await stockRepository.save(stock1);
    await stockRepository.save(stock2);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result.map(s => s.symbol)).toContain('AAPL');
    expect(result.map(s => s.symbol)).toContain('GOOGL');
  });

  test('Should not return unlisted stocks', async () => {
    const { useCase, stockRepository } = getData();

    const company = createTestCompany();
    const listedStock = createTestStock('AAPL', 'Apple Inc.', company, true);
    const unlistedStock = createTestStock('PRIV', 'Private Co.', company, false);

    await stockRepository.save(listedStock);
    await stockRepository.save(unlistedStock);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe('AAPL');
  });

  test('Should return stocks with correct properties', async () => {
    const { useCase, stockRepository } = getData();

    const company = createTestCompany('Tech Corp');
    const stock = createTestStock('TECH', 'Tech Corporation', company);

    await stockRepository.save(stock);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe('TECH');
    expect(result[0].name).toBe('Tech Corporation');
    expect(result[0].isListed).toBe(true);
    expect(result[0].company.name).toBe('Tech Corp');
  });

  test('Should return stocks from multiple companies', async () => {
    const { useCase, stockRepository } = getData();

    const company1 = createTestCompany('Company A');
    const company2 = createTestCompany('Company B');

    const stock1 = createTestStock('STKA', 'Stock A', company1);
    const stock2 = createTestStock('STKB', 'Stock B', company2);

    await stockRepository.save(stock1);
    await stockRepository.save(stock2);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result.map(s => s.company.name)).toContain('Company A');
    expect(result.map(s => s.company.name)).toContain('Company B');
  });
});
