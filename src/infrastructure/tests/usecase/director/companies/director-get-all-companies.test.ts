import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain';
import { InMemoryCompanyRepository } from '@pp-clca-pcm/adapters';
import { DirectorGetAllCompanies } from '@pp-clca-pcm/application';

describe('Director Get All Companies', () => {
  const getData = () => {
    const companyRepository = new InMemoryCompanyRepository();
    const useCase = new DirectorGetAllCompanies(companyRepository);

    return {
      useCase,
      companyRepository,
    };
  };

  test('Should return empty array when no companies', async () => {
    const { useCase } = getData();

    const result = await useCase.execute();

    expect(result).instanceof(Array);
    expect(result).toHaveLength(0);
  });

  test('Should return all companies', async () => {
    const { useCase, companyRepository } = getData();

    const company1 = Company.create('Company A');
    const company2 = Company.create('Company B');
    const company3 = Company.create('Company C');

    await companyRepository.create(company1);
    await companyRepository.create(company2);
    await companyRepository.create(company3);

    const result = await useCase.execute();

    expect(result).instanceof(Array);
    expect(result).toHaveLength(3);

    const names = result.map((c) => c.name);
    expect(names).toContain('Company A');
    expect(names).toContain('Company B');
    expect(names).toContain('Company C');
  });

  test('Should return single company when only one exists', async () => {
    const { useCase, companyRepository } = getData();

    const company = Company.create('Solo Company');
    await companyRepository.create(company);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Solo Company');
  });
});
