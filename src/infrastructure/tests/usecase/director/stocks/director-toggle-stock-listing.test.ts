import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { InMemoryStockRepository } from '@pp-clca-pcm/adapters/repositories/memory/stock/stock';
import { DirectorToggleStockListing } from '@pp-clca-pcm/application/usecases/director/stocks/director-toggle-stock-listing';
import { DirectorToggleStockListingError } from '@pp-clca-pcm/application/errors/director-toggle-stock-listing';

describe('Director Toggle Stock Listing', () => {
  const getData = () => {
    const stockRepository = new InMemoryStockRepository();
    const useCase = new DirectorToggleStockListing(stockRepository);

    return {
      useCase,
      stockRepository,
    };
  };

  const createTestCompany = () => {
    return Company.create('Test Company');
  };

  const createTestStock = async (
    stockRepository: InMemoryStockRepository,
    company: Company,
    isListed: boolean = true
  ) => {
    let stock = Stock.create('AAPL', 'Apple Inc', company);
    if (!isListed) {
      stock = stock.toggleListed();
    }
    await stockRepository.save(stock);
    return stock;
  };

  test('Should toggle stock from listed to unlisted', async () => {
    const { useCase, stockRepository } = getData();
    const company = createTestCompany();
    const stock = await createTestStock(stockRepository, company, true);

    expect(stock.isListed).toBe(true);

    const result = await useCase.execute(stock.identifier!);

    expect(result).not.instanceof(Error);
    expect(result).instanceof(Stock);

    const toggledStock = result as Stock;
    expect(toggledStock.isListed).toBe(false);

    const storedStock = await stockRepository.findById(stock.identifier!);
    expect(storedStock?.isListed).toBe(false);
  });

  test('Should toggle stock from unlisted to listed', async () => {
    const { useCase, stockRepository } = getData();
    const company = createTestCompany();
    const stock = await createTestStock(stockRepository, company, false);

    expect(stock.isListed).toBe(false);

    const result = await useCase.execute(stock.identifier!);

    expect(result).instanceof(Stock);
    const toggledStock = result as Stock;
    expect(toggledStock.isListed).toBe(true);
  });

  test('Should return error when stock not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('non-existent-id');

    expect(result).instanceof(DirectorToggleStockListingError);
  });

  test('Should toggle stock multiple times', async () => {
    const { useCase, stockRepository } = getData();
    const company = createTestCompany();
    const stock = await createTestStock(stockRepository, company, true);

    const result1 = await useCase.execute(stock.identifier!);
    expect((result1 as Stock).isListed).toBe(false);

    const result2 = await useCase.execute(stock.identifier!);
    expect((result2 as Stock).isListed).toBe(true);

    const result3 = await useCase.execute(stock.identifier!);
    expect((result3 as Stock).isListed).toBe(false);
  });

  test('Should preserve other stock properties when toggling', async () => {
    const { useCase, stockRepository } = getData();
    const company = createTestCompany();
    const stock = await createTestStock(stockRepository, company);

    const result = await useCase.execute(stock.identifier!);

    expect(result).instanceof(Stock);
    const toggledStock = result as Stock;
    expect(toggledStock.identifier).toBe(stock.identifier);
    expect(toggledStock.symbol).toBe(stock.symbol);
    expect(toggledStock.name).toBe(stock.name);
    expect(toggledStock.company.identifier).toBe(company.identifier);
  });
});
