import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters/repositories/memory/account/account';
import { ClientUpdateNameAccount } from '@pp-clca-pcm/application/usecases/client/accounts/client-update-name-account';

describe('Client Update Name Account', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);

    const useCase = new ClientUpdateNameAccount(accountRepository);

    return {
      useCase,
      userRepository,
      accountRepository,
    };
  };

  const createTestUser = () => {
    return User.fromPrimitives({
      identifier: 'user-123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'jdoe@yopmail.com',
      password: 'hashedPassword123',
      clientProps: new ClientProps(),
    });
  };

  const createTestAccountType = () => {
    return AccountType.create('DEFAULT', 0, 'Default checking account');
  };

  test('Should update account name successfully', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Ancien nom');
    await accountRepository.save(account);

    const result = await useCase.execute(account, 'Nouveau nom');

    expect(result).instanceof(Account);
    expect(result.name).toBe('Nouveau nom');
  });

  test('Should preserve account properties when updating name', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = AccountType.create('SAVINGS', 2.5, 'Savings account');
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Original');
    await accountRepository.save(account);

    const result = await useCase.execute(account, 'Updated');

    if (result instanceof Error) {
      throw result;
    }

    expect(result.identifier).toBe(account.identifier);
    expect(result.owner.identifier).toBe(user.identifier);
    expect(result.type.name).toBe('SAVINGS');
    expect(result.type.rate).toBe(2.5);
    expect(result.iban.value).toBe(iban.value);
    expect(result.emittedTransactions).toEqual([]);
    expect(result.receivedTransactions).toEqual([]);
  });

  test('Should update account in repository', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Before');
    await accountRepository.save(account);

    await useCase.execute(account, 'After');

    const fetchedAccount = await accountRepository.findById(account.identifier!);

    expect(fetchedAccount).not.toBeNull();
    expect(fetchedAccount?.name).toBe('After');
  });

  test('Should handle empty name string', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Has Name');
    await accountRepository.save(account);

    const result = await useCase.execute(account, '');

    expect(result.name).toBe('');
  });

  test('Should handle very long name', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Short');
    await accountRepository.save(account);

    const longName = 'A'.repeat(500);
    const result = await useCase.execute(account, longName);

    expect(result.name).toBe(longName);
    expect(result.name?.length).toBe(500);
  });
});
