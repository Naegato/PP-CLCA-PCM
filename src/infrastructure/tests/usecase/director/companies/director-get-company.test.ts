import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain';
import { InMemoryCompanyRepository } from '@pp-clca-pcm/adapters';
import { DirectorGetCompany } from '@pp-clca-pcm/application';
import { DirectorGetCompanyError } from '@pp-clca-pcm/application';

describe('Director Get Company', () => {
  const getData = () => {
    const companyRepository = new InMemoryCompanyRepository();
    const useCase = new DirectorGetCompany(companyRepository);

    return {
      useCase,
      companyRepository,
    };
  };

  test('Should return company by id', async () => {
    const { useCase, companyRepository } = getData();

    const company = Company.create('Test Company');
    await companyRepository.create(company);

    const result = await useCase.execute(company.identifier);

    expect(result).not.instanceof(Error);
    expect(result).instanceof(Company);

    const foundCompany = result as Company;
    expect(foundCompany.identifier).toBe(company.identifier);
    expect(foundCompany.name).toBe('Test Company');
  });

  test('Should return error when company not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('non-existent-id');

    expect(result).instanceof(DirectorGetCompanyError);
  });

  test('Should return correct company when multiple exist', async () => {
    const { useCase, companyRepository } = getData();

    const company1 = Company.create('Company A');
    const company2 = Company.create('Company B');
    const company3 = Company.create('Company C');

    await companyRepository.create(company1);
    await companyRepository.create(company2);
    await companyRepository.create(company3);

    const result = await useCase.execute(company2.identifier);

    expect(result).instanceof(Company);
    const foundCompany = result as Company;
    expect(foundCompany.name).toBe('Company B');
  });
});
