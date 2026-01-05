import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain/constants/bank';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters/repositories/memory/account/account';
import { ClientSavingAccountCreate } from '@pp-clca-pcm/application/usecases/client/accounts/client-saving-account-create';
import { AccountCreateError } from '@pp-clca-pcm/application/errors/account-create';

describe('Client Saving Account Create', () => {
  const getData = (limitByClient: number | null = null, rate: number = 2.5) => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);

    const savingsAccountType = AccountType.create('SAVINGS', rate, 'Savings account with interest')
      .update({ identifier: 'savings-type-id', limitByClient });

    const useCase = new ClientSavingAccountCreate(savingsAccountType, accountRepository);

    return {
      useCase,
      userRepository,
      accountRepository,
      savingsAccountType,
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

  test('Should create savings account successfully', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Mon épargne');

    expect(result).not.instanceof(Error);
    expect(result).instanceof(Account);

    const account = result as Account;
    expect(account.name).toBe('Mon épargne');
    expect(account.owner.identifier).toBe(user.identifier);
    expect(account.type.name).toBe('SAVINGS');
  });

  test('Should create savings account with custom name', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Épargne Vacances');

    expect(result).instanceof(Account);
    const account = result as Account;
    expect(account.name).toBe('Épargne Vacances');
  });

  test('Should apply interest rate from savings account type', async () => {
    const { useCase, userRepository } = getData(null, 3.5);

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'High Interest Savings');

    expect(result).instanceof(Account);
    const account = result as Account;
    expect(account.type.rate).toBe(3.5);
  });

  test('Should generate valid French IBAN for savings account', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Savings');

    expect(result).instanceof(Account);
    const account = result as Account;

    // French IBAN is 27 characters
    expect(account.iban.value).toHaveLength(27);
    expect(account.iban.value.startsWith('FR')).toBe(true);
  });

  test('Should save savings account to repository', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Savings');

    expect(result).instanceof(Account);
    const account = result as Account;

    const savedAccount = await accountRepository.findById(account.identifier!);
    expect(savedAccount).not.toBeNull();
    expect(savedAccount?.type.name).toBe('SAVINGS');
  });

  test('Should return AccountCreateError when savings account limit reached', async () => {
    const { useCase, userRepository, accountRepository, savingsAccountType } = getData(2);

    // Create user with 2 existing savings accounts
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;

    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;

    const user = createTestUser();
    const existingAccount1 = Account.create(user, savingsAccountType, iban1, 'Épargne 1');
    const existingAccount2 = Account.create(user, savingsAccountType, iban2, 'Épargne 2');

    const userWithAccounts = User.fromPrimitives({
      identifier: user.identifier!,
      firstname: 'John',
      lastname: 'Doe',
      email: 'jdoe@yopmail.com',
      password: 'hashedPassword123',
      clientProps: new ClientProps([existingAccount1, existingAccount2]),
    });

    await userRepository.save(userWithAccounts);

    // Try to create a 3rd savings account (should fail, limit is 2)
    const result = await useCase.execute(userWithAccounts, 'Épargne 3');

    expect(result).instanceof(AccountCreateError);
  });

  test('Should allow creating savings account when no limit set', async () => {
    const { useCase, userRepository, accountRepository, savingsAccountType } = getData(null);

    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;

    const user = createTestUser();
    const existingAccount = Account.create(user, savingsAccountType, iban, 'Existing');

    const userWithAccounts = User.fromPrimitives({
      identifier: user.identifier!,
      firstname: 'John',
      lastname: 'Doe',
      email: 'jdoe@yopmail.com',
      password: 'hashedPassword123',
      clientProps: new ClientProps([existingAccount]),
    });

    await userRepository.save(userWithAccounts);

    const result = await useCase.execute(userWithAccounts, 'Another savings');

    expect(result).not.instanceof(Error);
    expect(result).instanceof(Account);
  });

  test('Should calculate daily interest for savings account with balance', async () => {
    const { useCase, userRepository, accountRepository } = getData(null, 3.65); // 3.65% annual = ~0.01% daily

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Interest Test');

    expect(result).instanceof(Account);
    let account = result as Account;

    // Add a deposit to test interest calculation
    const deposit = Transaction.create(account, 36500, 'Initial deposit');
    account = account.update({
      receivedTransactions: [deposit],
    });

    // Daily interest on 36500 at 3.65% annual = 36500 * 0.0365 / 365 = 3.65
    const dailyInterest = account.calculateDailyInterest();
    expect(dailyInterest).toBe(3.65);
  });

  test('Should return zero daily interest for empty savings account', async () => {
    const { useCase, userRepository } = getData(null, 5.0);

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'Empty Savings');

    expect(result).instanceof(Account);
    const account = result as Account;

    // No balance = no interest
    expect(account.calculateDailyInterest()).toBe(0);
  });

  test('Should create savings account with zero initial balance', async () => {
    const { useCase, userRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const result = await useCase.execute(user, 'New Savings');

    expect(result).instanceof(Account);
    const account = result as Account;
    expect(account.balance).toBe(0);
    expect(account.emittedTransactions).toEqual([]);
    expect(account.receivedTransactions).toEqual([]);
  });
});
