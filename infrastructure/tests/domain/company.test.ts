import { describe, expect, test } from 'vitest';
import { Company } from '@pp-clca-pcm/domain/entities/company';

describe('Company entity', () => {
  test('should create a company', () => {
    const companyName = 'Test Company';
    const company = Company.create(companyName);

    expect(company).toBeInstanceOf(Company);
    expect(company.name).toBe(companyName);
    expect(company.identifier).toBeDefined();
  });

  test('should update a company name', () => {
    const initialName = 'Initial Company';
    const company = Company.create(initialName);

    const newName = 'Updated Company';
    const updatedCompany = company.update({ name: newName });

    expect(updatedCompany.name).toBe(newName);
    expect(updatedCompany.identifier).toBe(company.identifier);
  });
});
