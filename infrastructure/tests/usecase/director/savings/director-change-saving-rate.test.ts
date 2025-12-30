import { describe, expect, test } from 'vitest';
import { AccountType, AccountTypeName } from '@pp-clca-pcm/domain/entities/accounts/type';
import { InMemoryAccountTypeRepository } from '@pp-clca-pcm/adapters/repositories/memory/account/type';
import { DirectorChangeSavingRate } from '@pp-clca-pcm/application/usecases/director/savings/director-change-saving-rate';
import { AccountTypeAlreadyExistError } from '@pp-clca-pcm/application/errors/account-type-already-exist';

describe('Director Change Saving Rate', () => {
  const getData = () => {
    const accountTypeRepository = new InMemoryAccountTypeRepository();
    const useCase = new DirectorChangeSavingRate(accountTypeRepository);

    return {
      useCase,
      accountTypeRepository,
    };
  };

  test('Should create new account type if not exists', async () => {
    const { useCase, accountTypeRepository } = getData();

    const result = await useCase.execute('SAVING' as AccountTypeName, 2.5);

    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBeInstanceOf(AccountType);

    const accountType = result as AccountType;
    expect(accountType.name).toBe('SAVING');
    expect(accountType.rate).toBe(2.5);

    expect(accountTypeRepository.inMemoryAccountTypes).toHaveLength(1);
  });

  test('Should update existing account type rate', async () => {
    const { useCase, accountTypeRepository } = getData();

    const existingType = AccountType.create('SAVING' as AccountTypeName, 1.0);
    await accountTypeRepository.save(existingType);

    const result = await useCase.execute('SAVING' as AccountTypeName, 3.5);

    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBeInstanceOf(AccountType);

    const updatedType = result as AccountType;
    expect(updatedType.name).toBe('SAVING');
    expect(updatedType.rate).toBe(3.5);

    expect(accountTypeRepository.inMemoryAccountTypes).toHaveLength(1);
  });

  test('Should create different account types', async () => {
    const { useCase, accountTypeRepository } = getData();

    const result1 = await useCase.execute('SAVING' as AccountTypeName, 2.0);
    const result2 = await useCase.execute('DEFAULT' as AccountTypeName, 0.5);

    expect(result1).toBeInstanceOf(AccountType);
    expect(result2).toBeInstanceOf(AccountType);

    expect((result1 as AccountType).name).toBe('SAVING');
    expect((result2 as AccountType).name).toBe('DEFAULT');

    expect(accountTypeRepository.inMemoryAccountTypes).toHaveLength(2);
  });

  test('Should update rate to zero', async () => {
    const { useCase, accountTypeRepository } = getData();

    const existingType = AccountType.create('SAVING' as AccountTypeName, 5.0);
    await accountTypeRepository.save(existingType);

    const result = await useCase.execute('SAVING' as AccountTypeName, 0);

    expect(result).toBeInstanceOf(AccountType);
    const updatedType = result as AccountType;
    expect(updatedType.rate).toBe(0);
  });

  test('Should handle decimal rates', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('SAVING' as AccountTypeName, 2.75);

    expect(result).toBeInstanceOf(AccountType);
    const accountType = result as AccountType;
    expect(accountType.rate).toBe(2.75);
  });

  test('Should preserve account type identifier on update', async () => {
    const { useCase, accountTypeRepository } = getData();

    const existingType = AccountType.create('SAVING' as AccountTypeName, 1.0);
    await accountTypeRepository.save(existingType);

    const result = await useCase.execute('SAVING' as AccountTypeName, 3.0);

    expect(result).toBeInstanceOf(AccountType);
    const updatedType = result as AccountType;
    expect(updatedType.identifier).toBe(existingType.identifier);
  });
});
