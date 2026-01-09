import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain';
import { Stock } from '@pp-clca-pcm/domain';
import { InMemoryCompanyRepository } from '@pp-clca-pcm/adapters';
import { InMemoryStockRepository } from '@pp-clca-pcm/adapters';
import { DirectorDeleteCompany } from '@pp-clca-pcm/application';
import { DirectorDeleteCompanyError } from '@pp-clca-pcm/application';

describe('Director Delete Company', () => {
  const getData = () => {
    const companyRepository = new InMemoryCompanyRepository();
    const stockRepository = new InMemoryStockRepository();
    const useCase = new DirectorDeleteCompany(companyRepository, stockRepository);

    return {
      useCase,
      companyRepository,
      stockRepository,
    };
  };

  test('Should delete company successfully', async () => {
    const { useCase, companyRepository } = getData();

    const company = Company.create('To Delete');
    await companyRepository.create(company);

    expect(companyRepository.companies).toHaveLength(1);

    const result = await useCase.execute(company.identifier);

    expect(result).toBeUndefined();
    expect(companyRepository.companies).toHaveLength(0);
  });

  test('Should return error when company not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('non-existent-id');

    expect(result).instanceof(DirectorDeleteCompanyError);
  });

  test('Should return error when company has associated stocks', async () => {
    const { useCase, companyRepository, stockRepository } = getData();

    const company = Company.create('Company With Stocks');
    await companyRepository.create(company);

    const stock = Stock.create('AAPL', 'Apple Inc', company);
    await stockRepository.save(stock);

    const result = await useCase.execute(company.identifier);

    expect(result).instanceof(DirectorDeleteCompanyError);
    expect(companyRepository.companies).toHaveLength(1);
  });

  test('Should delete company after its stocks are removed', async () => {
    const { useCase, companyRepository, stockRepository } = getData();

    const company = Company.create('Company With Stocks');
    await companyRepository.create(company);

    const stock = Stock.create('AAPL', 'Apple Inc', company);
    await stockRepository.save(stock);

    await stockRepository.delete(stock.identifier!);

    const result = await useCase.execute(company.identifier);

    expect(result).toBeUndefined();
    expect(companyRepository.companies).toHaveLength(0);
  });
});
