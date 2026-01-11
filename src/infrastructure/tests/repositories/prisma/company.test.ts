import { PrismaCompanyRepository } from '@pp-clca-pcm/adapters';
import { prisma } from '@pp-clca-pcm/adapters';
import { Company } from '@pp-clca-pcm/domain';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const databaseProvider = process.env.DB_PROVIDER;
const isPostgres = databaseProvider === 'postgresql';

describe.skipIf(!isPostgres)('Prisma Company Repository', async () => {
  const repository = new PrismaCompanyRepository(prisma);

  beforeAll(async () => {
    await prisma.$transaction([
      prisma.portfolioItem.deleteMany(),
      prisma.portfolio.deleteMany(),
      prisma.stockOrder.deleteMany(),
      prisma.stock.deleteMany(),
      prisma.company.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.portfolioItem.deleteMany(),
      prisma.portfolio.deleteMany(),
      prisma.stockOrder.deleteMany(),
      prisma.stock.deleteMany(),
      prisma.company.deleteMany(),
    ]);
  });

  test('create - should create a new company', async () => {
    const company = Company.create('Test Company Inc.');
    const created = await repository.create(company);

    expect(created.identifier).toBeDefined();
    expect(created.name).toBe('Test Company Inc.');
  });

  test('findById - should find company by id', async () => {
    const company = Company.create('FindById Company');
    await repository.create(company);

    const found = await repository.findById(company.identifier);

    expect(found).not.toBeNull();
    expect(found?.name).toBe('FindById Company');
  });

  test('findById - should return null for non-existent id', async () => {
    const found = await repository.findById('non-existent-id');

    expect(found).toBeNull();
  });

  test('findByName - should find company by name', async () => {
    const company = Company.create('Unique Company Name');
    await repository.create(company);

    const found = await repository.findByName('Unique Company Name');

    expect(found).not.toBeNull();
    expect(found?.identifier).toBe(company.identifier);
  });

  test('findByName - should be case insensitive', async () => {
    const company = Company.create('CaseSensitive Company');
    await repository.create(company);

    const found = await repository.findByName('casesensitive company');

    expect(found).not.toBeNull();
    expect(found?.name).toBe('CaseSensitive Company');
  });

  test('findByName - should return null for non-existent name', async () => {
    const found = await repository.findByName('Non Existent Company');

    expect(found).toBeNull();
  });

  test('findAll - should return all companies', async () => {
    await repository.create(Company.create('Company One'));
    await repository.create(Company.create('Company Two'));

    const companies = await repository.findAll();

    expect(companies.length).toBeGreaterThanOrEqual(2);
  });

  test('update - should update company', async () => {
    const company = Company.create('Original Name');
    await repository.create(company);

    const updated = company.update({ name: 'Updated Name' });
    await repository.update(updated);

    const found = await repository.findById(company.identifier);

    expect(found).not.toBeNull();
    expect(found?.name).toBe('Updated Name');
  });

  test('delete - should delete company', async () => {
    const company = Company.create('To Be Deleted');
    await repository.create(company);

    await repository.delete(company.identifier);

    const found = await repository.findById(company.identifier);

    expect(found).toBeNull();
  });

  test('delete - should not throw error for non-existent company', async () => {
    await expect(repository.delete('non-existent-id')).resolves.not.toThrow();
  });
});
