import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain';
import { InMemoryCompanyRepository } from '@pp-clca-pcm/adapters';
import { DirectorCreateCompany } from '@pp-clca-pcm/application';
import { DirectorCreateCompanyError } from '@pp-clca-pcm/application';

describe('Director Create Company', () => {
  const getData = () => {
    const companyRepository = new InMemoryCompanyRepository();
    const useCase = new DirectorCreateCompany(companyRepository);

    return {
      useCase,
      companyRepository,
    };
  };

  test('Should create company successfully', async () => {
    const { useCase, companyRepository } = getData();

    const result = await useCase.execute('Acme Corporation');

    expect(result).not.instanceof(Error);
    expect(result).instanceof(Company);

    const company = result as Company;
    expect(company.name).toBe('Acme Corporation');
    expect(company.identifier).toBeDefined();

    expect(companyRepository.companies).toHaveLength(1);
    expect(companyRepository.companies[0].name).toBe('Acme Corporation');
  });

  test('Should return error when company name already exists', async () => {
    const { useCase, companyRepository } = getData();

    const existingCompany = Company.create('Acme Corporation');
    await companyRepository.create(existingCompany);

    const result = await useCase.execute('Acme Corporation');

    expect(result).instanceof(DirectorCreateCompanyError);
  });

  test('Should create multiple companies with different names', async () => {
    const { useCase, companyRepository } = getData();

    const result1 = await useCase.execute('Company A');
    const result2 = await useCase.execute('Company B');

    expect(result1).instanceof(Company);
    expect(result2).instanceof(Company);
    expect(companyRepository.companies).toHaveLength(2);
  });
});
