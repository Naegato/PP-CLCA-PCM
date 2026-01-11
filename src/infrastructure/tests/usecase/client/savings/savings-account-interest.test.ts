import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { Transaction } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';

describe('Savings Account Interest', () => {
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

  const createSavingsAccount = async (rate: number, balance: number = 0) => {
    const user = createTestUser();
    const accountType = AccountType.create('SAVINGS', rate, 'Savings account with interest');
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, '00000000001');
    if (iban instanceof Error) throw iban;

    let account = Account.create(user, accountType, iban, 'Mon épargne');

    if (balance > 0) {
      const deposit = Transaction.create(account, balance, 'Initial deposit');
      account = account.update({
        receivedTransactions: [deposit],
      });
    }

    return account;
  };

  test('Should return 0 interest for account with zero balance', async () => {
    const account = await createSavingsAccount(5.0, 0);

    const interest = account.calculateDailyInterest();

    expect(interest).toBe(0);
  });

  test('Should return 0 interest for account with zero rate', async () => {
    const account = await createSavingsAccount(0, 10000);

    const interest = account.calculateDailyInterest();

    expect(interest).toBe(0);
  });

  test('Should return 0 interest for account with negative balance', async () => {
    const user = createTestUser();
    const accountType = AccountType.create('SAVINGS', 5.0, 'Savings');
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, '00000000001');
    if (iban instanceof Error) throw iban;

    let account = Account.create(user, accountType, iban, 'Test');

    // Create negative balance by having more emitted than received
    const withdrawal = Transaction.create(account, 100, 'Withdrawal');
    account = account.update({
      emittedTransactions: [withdrawal],
    });

    const interest = account.calculateDailyInterest();

    expect(interest).toBe(0);
  });

  test('Should calculate daily interest correctly', async () => {
    // 3.65% annual rate on 36500 balance = 3.65 per day
    // (36500 * 0.0365 / 365 = 3.65)
    const account = await createSavingsAccount(3.65, 36500);

    const interest = account.calculateDailyInterest();

    expect(interest).toBe(3.65);
  });

  test('Should calculate interest with 2.5% annual rate', async () => {
    // 2.5% annual on 10000 = 10000 * 0.025 / 365 = 0.6849...
    // Rounded to cents = 0.68
    const account = await createSavingsAccount(2.5, 10000);

    const interest = account.calculateDailyInterest();

    expect(interest).toBeCloseTo(0.68, 2);
  });

  test('Should calculate interest with high balance', async () => {
    // 5% annual on 1000000 = 1000000 * 0.05 / 365 = 136.986...
    // Rounded = 136.99
    const account = await createSavingsAccount(5.0, 1000000);

    const interest = account.calculateDailyInterest();

    expect(interest).toBeCloseTo(136.99, 1);
  });

  test('Should calculate interest with small balance', async () => {
    // 2% annual on 100 = 100 * 0.02 / 365 = 0.00548...
    // Rounded = 0.01
    const account = await createSavingsAccount(2.0, 100);

    const interest = account.calculateDailyInterest();

    expect(interest).toBeCloseTo(0.01, 2);
  });

  test('Should return 0 for very small interest that rounds to 0', async () => {
    // 1% annual on 10 = 10 * 0.01 / 365 = 0.000274...
    // Rounded = 0.00
    const account = await createSavingsAccount(1.0, 10);

    const interest = account.calculateDailyInterest();

    expect(interest).toBe(0);
  });

  test('Should calculate interest on net balance after transactions', async () => {
    const user = createTestUser();
    const accountType = AccountType.create('SAVINGS', 3.65, 'Savings');
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, '00000000001');
    if (iban instanceof Error) throw iban;

    let account = Account.create(user, accountType, iban, 'Test');

    // Deposit 50000, withdraw 13500 = net 36500
    const deposit = Transaction.create(account, 50000, 'Deposit');
    const withdrawal = Transaction.create(account, 13500, 'Withdrawal');

    account = account.update({
      receivedTransactions: [deposit],
      emittedTransactions: [withdrawal],
    });

    // 3.65% on 36500 = 3.65 per day
    const interest = account.calculateDailyInterest();

    expect(interest).toBe(3.65);
  });

  test('Should not return negative interest', async () => {
    // Even with negative balance, interest should be 0 not negative
    const user = createTestUser();
    const accountType = AccountType.create('SAVINGS', 5.0, 'Savings');
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, '00000000001');
    if (iban instanceof Error) throw iban;

    let account = Account.create(user, accountType, iban, 'Test');

    const withdrawal = Transaction.create(account, 1000, 'Overdraft');
    account = account.update({
      emittedTransactions: [withdrawal],
    });

    expect(account.balance).toBe(-1000);

    const interest = account.calculateDailyInterest();

    expect(interest).toBe(0);
    expect(interest).toBeGreaterThanOrEqual(0);
  });
});
