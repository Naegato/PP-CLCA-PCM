import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters/repositories/memory/account/account';
import { ClientGetAccount } from '@pp-clca-pcm/application/usecases/client/accounts/client-get-account';

describe('Client Get Account', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);

    const useCase = new ClientGetAccount(accountRepository);

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

  test('Should return account when found by ID', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) {
      throw iban;
    }

    const account = Account.create(user, accountType, iban, 'Mon compte');
    await accountRepository.save(account);

    const result = await useCase.execute(account.identifier!);

    expect(result).not.toBeNull();
    expect(result).instanceof(Account);
    expect(result?.identifier).toBe(account.identifier);
    expect(result?.name).toBe('Mon compte');
  });

  test('Should return null when account not found', async () => {
    const { useCase } = getData();

    const result = await useCase.execute('non-existent-id');

    expect(result).toBeNull();
  });

  test('Should return correct account when multiple accounts exist', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();

    // Create first account
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;
    const account1 = Account.create(user, accountType, iban1, 'Compte 1');
    await accountRepository.save(account1);

    // Create second account
    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    const account2 = Account.create(user, accountType, iban2, 'Compte 2');
    await accountRepository.save(account2);

    // Create third account
    const accountNumber3 = await accountRepository.generateAccountNumber();
    const iban3 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber3);
    if (iban3 instanceof Error) throw iban3;
    const account3 = Account.create(user, accountType, iban3, 'Compte 3');
    await accountRepository.save(account3);

    // Search for the second account
    const result = await useCase.execute(account2.identifier!);

    expect(result).not.toBeNull();
    expect(result?.identifier).toBe(account2.identifier);
    expect(result?.name).toBe('Compte 2');
  });

  test('Should return account with all properties intact', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = AccountType.create('SAVINGS', 2.5, 'Savings account');
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Mon épargne');
    await accountRepository.save(account);

    const result = await useCase.execute(account.identifier!);

    expect(result).not.toBeNull();
    expect(result?.owner.identifier).toBe(user.identifier);
    expect(result?.type.name).toBe('SAVINGS');
    expect(result?.type.rate).toBe(2.5);
    expect(result?.iban.value).toBe(iban.value);
    expect(result?.name).toBe('Mon épargne');
    expect(result?.emittedTransactions).toEqual([]);
    expect(result?.receivedTransactions).toEqual([]);
  });
});
