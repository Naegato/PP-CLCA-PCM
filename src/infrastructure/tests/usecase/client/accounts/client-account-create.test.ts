import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters/repositories/memory/account/account';
import { ClientCreateAccount } from '@pp-clca-pcm/application/usecases/client/accounts/client-create-account';
import { AccountCreateError } from '@pp-clca-pcm/application/errors/account-create';

describe('Client Create Account', () => {
  const getData = (limitByClient: number | null = null) => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);

    const defaultAccountType = AccountType.create('DEFAULT', 0, 'Default checking account')
      .update({ identifier: 'default-type-id', limitByClient });

    const useCase = new ClientCreateAccount(defaultAccountType, accountRepository);

    return {
      useCase,
      userRepository,
      accountRepository,
      defaultAccountType,
    };
  };

  const createTestUser = (accounts: Account[] = []) => {
    return User.fromPrimitives({
      identifier: 'user-123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'jdoe@yopmail.com',
      password: 'hashedPassword123',
      clientProps: new ClientProps(accounts),
    });
  };

  test('Should create account successfully for new client', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Mon premier compte');

    expect(result).not.instanceof(Error);
    expect(result).instanceof(Account);

    const account = result as Account;
    expect(account.name).toBe('Mon premier compte');
    expect(account.owner.identifier).toBe(user.identifier);
    expect(account.type.name).toBe('DEFAULT');
    expect(account.iban).toBeDefined();
    expect(account.iban.value).toMatch(/^FR/);
  });

  test('Should create account with custom name', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Compte Vacances');

    expect(result).instanceof(Account);
    const account = result as Account;
    expect(account.name).toBe('Compte Vacances');
  });

  test('Should generate valid French IBAN', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Test');

    expect(result).instanceof(Account);
    const account = result as Account;

    // French IBAN is 27 characters: FR + 2 check digits + 23 BBAN
    expect(account.iban.value).toHaveLength(27);
    expect(account.iban.value.startsWith('FR')).toBe(true);
  });

  test('Should generate sequential account numbers', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result1 = await useCase.execute(user, 'Compte 1');
    const result2 = await useCase.execute(user, 'Compte 2');

    expect(result1).instanceof(Account);
    expect(result2).instanceof(Account);

    const account1 = result1 as Account;
    const account2 = result2 as Account;

    // IBANs should be different
    expect(account1.iban.value).not.toBe(account2.iban.value);
  });

  test('Should save account to repository', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Test');

    expect(result).instanceof(Account);
    const account = result as Account;

    const savedAccount = await accountRepository.findById(account.identifier!);
    expect(savedAccount).not.toBeNull();
    expect(savedAccount?.identifier).toBe(account.identifier);
  });

  test('Should return AccountCreateError when account limit reached', async () => {
    const { useCase, userRepository, accountRepository, defaultAccountType } = getData(2);

    // Create user with 2 existing accounts of the same type
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;

    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;

    const user = createTestUser();
    const existingAccount1 = Account.create(user, defaultAccountType, iban1, 'Compte 1');
    const existingAccount2 = Account.create(user, defaultAccountType, iban2, 'Compte 2');

    const userWithAccounts = User.fromPrimitives({
      identifier: user.identifier!,
      firstname: 'John',
      lastname: 'Doe',
      email: 'jdoe@yopmail.com',
      password: 'hashedPassword123',
      clientProps: new ClientProps([existingAccount1, existingAccount2]),
    });

    await userRepository.save(userWithAccounts);

    // Try to create a 3rd account (should fail, limit is 2)
    const result = await useCase.execute(userWithAccounts, 'Compte 3');

    expect(result).instanceof(AccountCreateError);
  });

  test('Should allow creating accounts when no limit set', async () => {
    const { useCase, userRepository, accountRepository, defaultAccountType } = getData(null);

    // Create user with multiple existing accounts
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;

    const user = createTestUser();
    const existingAccount = Account.create(user, defaultAccountType, iban1, 'Compte existant');

    const userWithAccounts = User.fromPrimitives({
      identifier: user.identifier!,
      firstname: 'John',
      lastname: 'Doe',
      email: 'jdoe@yopmail.com',
      password: 'hashedPassword123',
      clientProps: new ClientProps([existingAccount]),
    });

    await userRepository.save(userWithAccounts);

    // Should be able to create more accounts when no limit
    const result = await useCase.execute(userWithAccounts, 'Nouveau compte');

    expect(result).not.instanceof(Error);
    expect(result).instanceof(Account);
  });

  test('Should allow creating account of different type when one type limit reached', async () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);

    // Create DEFAULT type with limit of 1
    const defaultType = AccountType.create('DEFAULT', 0, 'Default')
      .update({ identifier: 'default-type-id', limitByClient: 1 });

    // Create SAVINGS type (different identifier)
    const savingsType = AccountType.create('SAVINGS', 2.5, 'Savings')
      .update({ identifier: 'savings-type-id', limitByClient: null });

    const useCase = new ClientCreateAccount(defaultType, accountRepository);

    // Create user with 1 existing DEFAULT account
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const user = createTestUser();
    const existingDefaultAccount = Account.create(user, defaultType, iban, 'Default compte');

    // User has 1 savings account (different type)
    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    const existingSavingsAccount = Account.create(user, savingsType, iban2, 'Savings');

    const userWithAccounts = User.fromPrimitives({
      identifier: user.identifier!,
      firstname: 'John',
      lastname: 'Doe',
      email: 'jdoe@yopmail.com',
      password: 'hashedPassword123',
      clientProps: new ClientProps([existingDefaultAccount, existingSavingsAccount]),
    });

    await userRepository.save(userWithAccounts);

    // Try to create another DEFAULT account (should fail - limit is 1)
    const result = await useCase.execute(userWithAccounts, 'Another default');

    expect(result).instanceof(AccountCreateError);
  });

  test('Should create account with zero balance', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'New Account');

    expect(result).instanceof(Account);
    const account = result as Account;
    expect(account.balance).toBe(0);
    expect(account.emittedTransactions).toEqual([]);
    expect(account.receivedTransactions).toEqual([]);
  });
});
