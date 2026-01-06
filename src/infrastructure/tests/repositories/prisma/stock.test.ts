import { PrismaStockRepository } from '@pp-clca-pcm/adapters/repositories/prisma/stock/stock';
import { prisma } from '@pp-clca-pcm/adapters/repositories/prisma/client';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { beforeAll, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma Stock Repository', async () => {
  const repository = new PrismaStockRepository(prisma);

  beforeAll(async () => {
    await prisma.$transaction([
      prisma.stock.deleteMany(),
      prisma.company.deleteMany(),
    ]);
  });

  const createTestCompany = async (name: string = `Company-${crypto.randomUUID()}`) => {
    const company = Company.create(name);
    await prisma.company.create({
      data: {
        identifier: company.identifier,
        name: company.name,
      },
    });
    return company;
  };

  test('save - should save a new stock', async () => {
    const company = await createTestCompany();
    const stock = Stock.create('AAPL', 'Apple Inc.', company);

    const saved = await repository.save(stock);

    expect(saved.identifier).toBeDefined();
    expect(saved.symbol).toBe('AAPL');
    expect(saved.name).toBe('Apple Inc.');
  });

  test('save - should update existing stock', async () => {
    const company = await createTestCompany();
    const stock = Stock.create('GOOGL', 'Google', company);
    await repository.save(stock);

    const updated = stock.update({ name: 'Alphabet Inc.' });
    await repository.save(updated);

    const found = await repository.findById(stock.identifier!);

    expect(found).not.toBeNull();
    expect(found?.name).toBe('Alphabet Inc.');
  });

  test('all - should return all stocks', async () => {
    const company = await createTestCompany();
    await repository.save(Stock.create('MSFT', 'Microsoft', company));
    await repository.save(Stock.create('AMZN', 'Amazon', company));

    const stocks = await repository.all();

    expect(stocks.length).toBeGreaterThanOrEqual(2);
  });

  test('getListedStocks - should return only listed stocks', async () => {
    const company = await createTestCompany();
    const listedStock = Stock.create('TSLA', 'Tesla', company);
    await repository.save(listedStock);

    const unlistedStock = Stock.create('PRIV', 'Private Co', company);
    const toggledStock = unlistedStock.toggleListed();
    await repository.save(toggledStock);

    const listed = await repository.getListedStocks();

    expect(listed.every(s => s.isListed)).toBe(true);
  });

  test('findById - should find stock by id', async () => {
    const company = await createTestCompany();
    const stock = Stock.create('NVDA', 'NVIDIA', company);
    await repository.save(stock);

    const found = await repository.findById(stock.identifier!);

    expect(found).not.toBeNull();
    expect(found?.symbol).toBe('NVDA');
  });

  test('findById - should return null for non-existent id', async () => {
    const found = await repository.findById('non-existent-id');

    expect(found).toBeNull();
  });

  test('findBySymbol - should find stock by symbol', async () => {
    const company = await createTestCompany();
    const stock = Stock.create('META', 'Meta Platforms', company);
    await repository.save(stock);

    const found = await repository.findBySymbol('META');

    expect(found).not.toBeNull();
    expect(found?.name).toBe('Meta Platforms');
  });

  test('findBySymbol - should be case insensitive', async () => {
    const company = await createTestCompany();
    const stock = Stock.create('NFLX', 'Netflix', company);
    await repository.save(stock);

    const found = await repository.findBySymbol('nflx');

    expect(found).not.toBeNull();
    expect(found?.symbol).toBe('NFLX');
  });

  test('findBySymbol - should return null for non-existent symbol', async () => {
    const found = await repository.findBySymbol('NONEXIST');

    expect(found).toBeNull();
  });

  test('delete - should delete stock', async () => {
    const company = await createTestCompany();
    const stock = Stock.create('DELL', 'Dell Technologies', company);
    await repository.save(stock);

    await repository.delete(stock.identifier!);

    const found = await repository.findById(stock.identifier!);

    expect(found).toBeNull();
  });

  test('findAllByCompanyId - should find stocks by company', async () => {
    const company1 = await createTestCompany('Company A');
    const company2 = await createTestCompany('Company B');

    await repository.save(Stock.create('CMP1A', 'Company 1 Stock A', company1));
    await repository.save(Stock.create('CMP1B', 'Company 1 Stock B', company1));
    await repository.save(Stock.create('CMP2A', 'Company 2 Stock A', company2));

    const company1Stocks = await repository.findAllByCompanyId(company1.identifier);

    expect(company1Stocks.length).toBeGreaterThanOrEqual(2);
    expect(company1Stocks.every(s => s.company.identifier === company1.identifier)).toBe(true);
  });

  test('save - should preserve stock creation date', async () => {
    const company = await createTestCompany();
    const stock = Stock.create('DATE', 'Date Test', company);
    const createdAt = stock.createdAt;

    await repository.save(stock);
    const found = await repository.findById(stock.identifier!);

    expect(found).not.toBeNull();
    expect(found?.createdAt.getTime()).toBe(createdAt.getTime());
  });
});
