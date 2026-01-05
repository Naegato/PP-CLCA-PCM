import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain/entities/company';
import { InMemoryCompanyRepository } from '@pp-clca-pcm/adapters/repositories/memory/company';
import { DirectorUpdateCompany } from '@pp-clca-pcm/application/usecases/director/companies/director-update-company';
import { DirectorUpdateCompanyError } from '@pp-clca-pcm/application/errors/director-update-company';

describe('Director Update Company', () => {
  const getData = () => {
    const companyRepository = new InMemoryCompanyRepository();
    const useCase = new DirectorUpdateCompany(companyRepository);

    return {
      useCase,
      companyRepository,
    };
  };

  test('Should update company name', async () => {
    const { useCase, companyRepository } = getData();

    const company = Company.create('Old Name');
    await companyRepository.create(company);

    const result = await useCase.execute(company.identifier, 'New Name');

    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBeInstanceOf(Company);

    const updatedCompany = result as Company;
    expect(updatedCompany.identifier).toBe(company.identifier);
    expect(updatedCompany.name).toBe('New Name');

    const storedCompany = await companyRepository.findById(company.identifier);
    expect(storedCompany?.name).toBe('New Name');
  });

  test('Should return error when company not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('non-existent-id', 'New Name');

    expect(result).toBeInstanceOf(DirectorUpdateCompanyError);
  });

  test('Should return error when new name already exists for different company', async () => {
    const { useCase, companyRepository } = getData();

    const company1 = Company.create('Company A');
    const company2 = Company.create('Company B');

    await companyRepository.create(company1);
    await companyRepository.create(company2);

    const result = await useCase.execute(company1.identifier, 'Company B');

    expect(result).toBeInstanceOf(DirectorUpdateCompanyError);
  });

  test('Should allow updating to same name (no change)', async () => {
    const { useCase, companyRepository } = getData();

    const company = Company.create('Same Name');
    await companyRepository.create(company);

    const result = await useCase.execute(company.identifier, 'Same Name');

    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBeInstanceOf(Company);

    const updatedCompany = result as Company;
    expect(updatedCompany.name).toBe('Same Name');
  });
});
