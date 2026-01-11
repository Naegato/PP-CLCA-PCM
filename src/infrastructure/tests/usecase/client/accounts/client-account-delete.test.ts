import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { Transaction } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters';
import { ClientDeleteAccount } from '@pp-clca-pcm/application';
import { AccountDeleteError } from '@pp-clca-pcm/application';

describe('Client Delete Account', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);

    const useCase = new ClientDeleteAccount(accountRepository, userRepository);

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
      password: 'hashedPasword123&',
      clientProps: new ClientProps(),
    });
  };

  const createTestAccountType = () => {
    return AccountType.create('DEFAULT', 0, 'Default checking account');
  };

  test('Should delete account successfully when user has multiple accounts and balance is zero', async () => {
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

    // Delete the first account (balance is 0)
    const result = await useCase.execute(account1);

    expect(result).toBeNull();

    // Verify account was deleted
    const deletedAccount = await accountRepository.findById(account1.identifier!);
    expect(deletedAccount).toBeNull();
  });

  test('Should return AccountDeleteError when user has only one account', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();

    // Create only one account
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
    if (iban instanceof Error) throw iban;
    const account = Account.create(user, accountType, iban, 'Seul compte');
    await accountRepository.save(account);

    // Try to delete the only account
    const result = await useCase.execute(account);

    expect(result).instanceof(AccountDeleteError);
    expect((result as AccountDeleteError).message).toBe('User must have at least one account');
  });

  test('Should return AccountDeleteError when account balance is positive', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();

    // Create first account with positive balance
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;
    const account1 = Account.create(user, accountType, iban1, 'Compte 1');

    // Add received transaction to create positive balance
    const deposit = Transaction.create(account1, 100, 'Deposit');
    const account1WithBalance = account1.update({
      receivedTransactions: [deposit],
    });
    await accountRepository.save(account1WithBalance);

    // Create second account
    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    const account2 = Account.create(user, accountType, iban2, 'Compte 2');
    await accountRepository.save(account2);

    // Try to delete account with positive balance
    const result = await useCase.execute(account1WithBalance);

    expect(result).instanceof(AccountDeleteError);
    expect((result as AccountDeleteError).message).toBe('Account balance must be zero to delete the account');
  });

  test('Should return AccountDeleteError when account balance is negative', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();

    // Create first account with negative balance
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;
    const account1 = Account.create(user, accountType, iban1, 'Compte 1');

    // Add emitted transaction to create negative balance
    const payment = Transaction.create(account1, 50, 'Payment');
    const account1WithBalance = account1.update({
      emittedTransactions: [payment],
    });
    await accountRepository.save(account1WithBalance);

    // Create second account
    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    const account2 = Account.create(user, accountType, iban2, 'Compte 2');
    await accountRepository.save(account2);

    // Try to delete account with negative balance
    const result = await useCase.execute(account1WithBalance);

    expect(result).instanceof(AccountDeleteError);
    expect((result as AccountDeleteError).message).toBe('Account balance must be zero to delete the account');
  });

  test('Should delete account when balance is exactly zero after transactions', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();

    // Create first account with zero balance (equal received and emitted)
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;
    const account1 = Account.create(user, accountType, iban1, 'Compte 1');

    const deposit = Transaction.create(account1, 100, 'Deposit');
    const withdrawal = Transaction.create(account1, 100, 'Withdrawal');
    const account1WithZeroBalance = account1.update({
      receivedTransactions: [deposit],
      emittedTransactions: [withdrawal],
    });
    await accountRepository.save(account1WithZeroBalance);

    // Create second account
    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    const account2 = Account.create(user, accountType, iban2, 'Compte 2');
    await accountRepository.save(account2);

    // Delete should succeed since balance is 0
    const result = await useCase.execute(account1WithZeroBalance);

    expect(result).toBeNull();

    // Verify account was deleted
    const deletedAccount = await accountRepository.findById(account1.identifier!);
    expect(deletedAccount).toBeNull();
  });

  test('Should keep remaining account in repository after deletion', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();

    // Create two accounts
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;
    const account1 = Account.create(user, accountType, iban1, 'À supprimer');
    await accountRepository.save(account1);

    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    const account2 = Account.create(user, accountType, iban2, 'À conserver');
    await accountRepository.save(account2);

    // Delete first account
    await useCase.execute(account1);

    // Verify second account is still there
    const remainingAccount = await accountRepository.findById(account2.identifier!);
    expect(remainingAccount).not.toBeNull();
    expect(remainingAccount?.name).toBe('À conserver');

    // Verify only one account remains
    const allAccounts = await accountRepository.all();
    expect(allAccounts.length).toBe(1);
  });

  test('Should allow deletion when user has three accounts', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();

    // Create three accounts
    const accounts: Account[] = [];
    for (let i = 1; i <= 3; i++) {
      const accountNumber = await accountRepository.generateAccountNumber();
      const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);
      if (iban instanceof Error) throw iban;
      const account = Account.create(user, accountType, iban, `Compte ${i}`);
      await accountRepository.save(account);
      accounts.push(account);
    }

    // Delete first account
    const result = await useCase.execute(accounts[0]);

    expect(result).toBeNull();

    // Verify two accounts remain
    const allAccounts = await accountRepository.all();
    expect(allAccounts.length).toBe(2);
  });
});
