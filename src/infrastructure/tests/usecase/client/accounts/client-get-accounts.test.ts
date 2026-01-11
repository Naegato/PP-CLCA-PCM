import { describe, expect, test } from 'vitest';

import { Account } from '@pp-clca-pcm/domain';
import { AccountType } from '@pp-clca-pcm/domain';
import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { Iban } from '@pp-clca-pcm/domain';
import { BANK_ATTRIBUTES } from '@pp-clca-pcm/domain';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters';
import { ClientGetAccounts } from '@pp-clca-pcm/application';
import { Security } from '@pp-clca-pcm/application';

class MockSecurity implements Security {
  constructor(private currentUser: User | null) {}

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }
}

describe('Client Get Accounts', () => {
  const createTestUser = (id: string = 'user-123') => {
    return User.fromPrimitives({
      identifier: id,
      firstname: 'John',
      lastname: 'Doe',
      email: `${id}@yopmail.com`,
      password: 'hashedPassword123',
      clientProps: new ClientProps(),
    });
  };

  const createTestAccountType = () => {
    return AccountType.create('DEFAULT', 0, 'Default checking account');
  };

  const getData = (currentUser: User | null) => {
    const userRepository = new InMemoryUserRepository();
    const accountRepository = new InMemoryAccountRepository(userRepository);
    const security = new MockSecurity(currentUser);

    const useCase = new ClientGetAccounts(accountRepository, security);

    return {
      useCase,
      userRepository,
      accountRepository,
    };
  };

  test('Should return null when no user is authenticated', async () => {
    const { useCase } = getData(null);

    const result = await useCase.execute();

    expect(result).toBeNull();
  });

  test('Should return empty array when user has no accounts', async () => {
    const user = createTestUser();
    const { useCase, userRepository } = getData(user);

    await userRepository.save(user);

    const result = await useCase.execute();

    expect(result).not.toBeNull();
    expect(result).toEqual([]);
  });

  test('Should return accounts for authenticated user', async () => {
    const user = createTestUser();
    const { useCase, userRepository, accountRepository } = getData(user);

    await userRepository.save(user);

    const accountType = createTestAccountType();
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) {
      throw iban;
    }

    const account = Account.create(user, accountType, iban, 'Mon compte');
    await accountRepository.save(account);

    const result = await useCase.execute();

    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0].name).toBe('Mon compte');
    expect(result![0].owner.identifier).toBe(user.identifier);
  });

  test('Should return multiple accounts for user', async () => {
    const user = createTestUser();
    const { useCase, userRepository, accountRepository } = getData(user);

    await userRepository.save(user);

    const accountType = createTestAccountType();

    // Create first account
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;
    const account1 = Account.create(user, accountType, iban1, 'Compte courant');
    await accountRepository.save(account1);

    // Create second account
    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    const account2 = Account.create(user, accountType, iban2, 'Compte epargne');
    await accountRepository.save(account2);

    // Create third account
    const accountNumber3 = await accountRepository.generateAccountNumber();
    const iban3 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber3);
    if (iban3 instanceof Error) throw iban3;
    const account3 = Account.create(user, accountType, iban3, 'Compte vacances');
    await accountRepository.save(account3);

    const result = await useCase.execute();

    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
  });

  test('Should only return accounts belonging to the current user', async () => {
    const user1 = createTestUser('user-1');
    const user2 = createTestUser('user-2');
    const { useCase, userRepository, accountRepository } = getData(user1);

    await userRepository.save(user1);
    await userRepository.save(user2);

    const accountType = createTestAccountType();

    // Create account for user1
    const accountNumber1 = await accountRepository.generateAccountNumber();
    const iban1 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber1);
    if (iban1 instanceof Error) throw iban1;
    const account1 = Account.create(user1, accountType, iban1, 'Compte user 1');
    await accountRepository.save(account1);

    // Create account for user2
    const accountNumber2 = await accountRepository.generateAccountNumber();
    const iban2 = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber2);
    if (iban2 instanceof Error) throw iban2;
    const account2 = Account.create(user2, accountType, iban2, 'Compte user 2');
    await accountRepository.save(account2);

    const result = await useCase.execute();

    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0].name).toBe('Compte user 1');
    expect(result![0].owner.identifier).toBe(user1.identifier);
  });

  test('Should return accounts with all properties intact', async () => {
    const user = createTestUser();
    const { useCase, userRepository, accountRepository } = getData(user);

    await userRepository.save(user);

    const accountType = AccountType.create('SAVINGS', 2.5, 'Savings account');
    const accountNumber = await accountRepository.generateAccountNumber();
    const iban = Iban.generate(BANK_ATTRIBUTES.BANK_CODE, BANK_ATTRIBUTES.BRANCH_CODE, accountNumber);

    if (iban instanceof Error) throw iban;

    const account = Account.create(user, accountType, iban, 'Mon epargne');
    await accountRepository.save(account);

    const result = await useCase.execute();

    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);

    const returnedAccount = result![0];
    expect(returnedAccount.owner.identifier).toBe(user.identifier);
    expect(returnedAccount.type.name).toBe('SAVINGS');
    expect(returnedAccount.type.rate).toBe(2.5);
    expect(returnedAccount.iban.value).toBe(iban.value);
    expect(returnedAccount.name).toBe('Mon epargne');
  });
});
