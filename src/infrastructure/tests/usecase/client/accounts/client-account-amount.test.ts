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
import { ClientGetBalanceAccount } from '@pp-clca-pcm/application';
import { ClientGetBalanceAccountError } from '@pp-clca-pcm/application';

describe('Client Get Balance Account', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);

    const useCase = new ClientGetBalanceAccount(accountRepository);

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

  test('Should return 0 for new account with no transactions', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Mon compte');
    await accountRepository.save(account);

    const result = await useCase.execute(account.identifier!);

    expect(result).toBe(0);
  });

  test('Should return positive balance when received > emitted', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Mon compte');

    // Add received transactions
    const transaction1 = Transaction.create(account, 100, 'Deposit 1');
    const transaction2 = Transaction.create(account, 50, 'Deposit 2');

    const accountWithTransactions = account.update({
      receivedTransactions: [transaction1, transaction2],
    });

    await accountRepository.save(accountWithTransactions);

    const result = await useCase.execute(account.identifier!);

    expect(result).toBe(150);
  });

  test('Should return negative balance when emitted > received', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Mon compte');

    // Add emitted transactions
    const transaction1 = Transaction.create(account, 200, 'Payment 1');
    const transaction2 = Transaction.create(account, 75, 'Payment 2');

    const accountWithTransactions = account.update({
      emittedTransactions: [transaction1, transaction2],
    });

    await accountRepository.save(accountWithTransactions);

    const result = await useCase.execute(account.identifier!);

    expect(result).toBe(-275);
  });

  test('Should calculate correct balance with mixed transactions', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Mon compte');

    // Add mixed transactions
    const received1 = Transaction.create(account, 500, 'Salary');
    const received2 = Transaction.create(account, 100, 'Gift');
    const emitted1 = Transaction.create(account, 150, 'Rent');
    const emitted2 = Transaction.create(account, 50, 'Groceries');

    const accountWithTransactions = account.update({
      receivedTransactions: [received1, received2],
      emittedTransactions: [emitted1, emitted2],
    });

    await accountRepository.save(accountWithTransactions);

    const result = await useCase.execute(account.identifier!);

    // Balance = (500 + 100) - (150 + 50) = 400
    expect(result).toBe(400);
  });

  test('Should throw ClientGetBalanceAccountError when account not found', async () => {
    const { useCase } = getData();

    const data = await useCase.execute('non-existent-id');

    expect(data).instanceof(ClientGetBalanceAccountError);
  });

  test('Should return zero balance when received equals emitted', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Mon compte');

    const received = Transaction.create(account, 200, 'Deposit');
    const emitted = Transaction.create(account, 200, 'Withdrawal');

    const accountWithTransactions = account.update({
      receivedTransactions: [received],
      emittedTransactions: [emitted],
    });

    await accountRepository.save(accountWithTransactions);

    const result = await useCase.execute(account.identifier!);

    expect(result).toBe(0);
  });
});
