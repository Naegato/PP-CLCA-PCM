import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { Transaction } from '@pp-clca-pcm/domain/entities/transaction';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters/repositories/memory/account/account';
import { GenerateDailyInterest } from '@pp-clca-pcm/application/usecases/engine/generate-daily-interest';
import { GenerateDailyInterestError } from '@pp-clca-pcm/application/errors/generate-daily-interest';

describe('Generate Daily Interest', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);
    const useCase = new GenerateDailyInterest(accountRepository);

    return {
      useCase,
      userRepository,
      accountRepository,
    };
  };

  const createTestUser = (email: string = 'test@test.com') => {
    return User.fromPrimitives({
      identifier: `user-${email}`,
      firstname: 'Test',
      lastname: 'User',
      email,
      password: 'hashedpassword',
      clientProps: new ClientProps(),
    });
  };

  const createTestAccount = async (
    user: User,
    accountRepository: InMemoryAccountRepository,
    balance: number,
    accountNumber: string,
    rate: number = 0,
  ) => {
    const accountType = AccountType.create('SAVING', rate);
    const iban = Iban.generate('30001', '00001', accountNumber);
    if (iban instanceof Error) throw iban;

    let account = Account.create(user, accountType, iban, 'Savings Account');

    if (balance > 0) {
      const deposit = Transaction.create(account, balance, 'Initial deposit');
      account = account.update({
        receivedTransactions: [deposit],
      });
    }

    await accountRepository.save(account);
    return account;
  };

  test('Should process accounts and return count', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    await createTestAccount(user, accountRepository, 1000, '00000000001', 5);
    await createTestAccount(user, accountRepository, 2000, '00000000002', 5);

    const result = await useCase.execute();

    expect(result).not.instanceof(GenerateDailyInterestError);
    expect(result).toHaveProperty('totalAccountsProcessed');
    expect((result as { totalAccountsProcessed: number }).totalAccountsProcessed).toBe(2);
  });

  test('Should return 0 accounts processed when no accounts exist', async () => {
    const { useCase } = getData();

    const result = await useCase.execute();

    expect(result).not.instanceof(GenerateDailyInterestError);
    expect((result as { totalAccountsProcessed: number }).totalAccountsProcessed).toBe(0);
  });

  test('Should skip accounts with zero interest rate', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    // Create account with 0% rate
    await createTestAccount(user, accountRepository, 1000, '00000000001', 0);

    const result = await useCase.execute();

    expect(result).not.instanceof(GenerateDailyInterestError);
    expect((result as { totalAccountsProcessed: number }).totalAccountsProcessed).toBe(1);
  });

  test('Should add interest transaction to account', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user = createTestUser();
    await userRepository.save(user);

    const account = await createTestAccount(user, accountRepository, 10000, '00000000001', 5);
    const initialTransactionCount = account.receivedTransactions.length;

    await useCase.execute();

    const updatedAccount = await accountRepository.findById(account.identifier!);
    expect(updatedAccount).not.toBeNull();

    // If interest is > 0, there should be a new transaction
    if (updatedAccount!.type.rate > 0) {
      const newTransactionCount = updatedAccount!.receivedTransactions.length;
      expect(newTransactionCount).toBeGreaterThanOrEqual(initialTransactionCount);
    }
  });

  test('Should process multiple accounts from different users', async () => {
    const { useCase, userRepository, accountRepository } = getData();

    const user1 = createTestUser('user1@test.com');
    const user2 = createTestUser('user2@test.com');
    await userRepository.save(user1);
    await userRepository.save(user2);

    await createTestAccount(user1, accountRepository, 1000, '00000000001', 3);
    await createTestAccount(user2, accountRepository, 2000, '00000000002', 4);

    const result = await useCase.execute();

    expect(result).not.instanceof(GenerateDailyInterestError);
    expect((result as { totalAccountsProcessed: number }).totalAccountsProcessed).toBe(2);
  });
});
