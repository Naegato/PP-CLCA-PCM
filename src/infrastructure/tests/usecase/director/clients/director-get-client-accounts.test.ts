import { describe, expect, test } from 'vitest';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { Account } from '@pp-clca-pcm/domain/entities/accounts/account';
import { AccountType } from '@pp-clca-pcm/domain/entities/accounts/type';
import { Iban } from '@pp-clca-pcm/domain/value-objects/iban';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { DirectorGetClientAccount } from '@pp-clca-pcm/application/usecases/director/clients/director-get-client-accounts';

describe('Director Get Client Accounts', () => {
  const getData = () => {
    const userRepository = new InMemoryUserRepository();
    const useCase = new DirectorGetClientAccount(userRepository);

    return {
      useCase,
      userRepository,
    };
  };

  const createTestClient = (email: string = 'client@test.com', accounts: Account[] = []) => {
    return User.fromPrimitives({
      identifier: `user-${email}`,
      firstname: 'John',
      lastname: 'Doe',
      email,
      password: 'hashedpassword',
      clientProps: new ClientProps(accounts),
    });
  };

  const createTestDirector = (email: string = 'director@test.com') => {
    return User.fromPrimitives({
      identifier: `user-${email}`,
      firstname: 'Director',
      lastname: 'User',
      email,
      password: 'hashedpassword',
      directorProps: new DirectorProps(),
    });
  };

  const createTestAccount = (owner: User, accountNumber: string, name: string = 'Test Account') => {
    const accountType = AccountType.create('DEFAULT', 0);
    const iban = Iban.generate('30001', '00001', accountNumber);
    if (iban instanceof Error) throw iban;
    return Account.create(owner, accountType, iban, name);
  };

  test('Should return client accounts', async () => {
    const { useCase, userRepository } = getData();

    const client = createTestClient('client@test.com');
    const account1 = createTestAccount(client, '00000000001', 'Account 1');
    const account2 = createTestAccount(client, '00000000002', 'Account 2');

    const clientWithAccounts = client.updateClientProps(new ClientProps([account1, account2]));
    await userRepository.save(clientWithAccounts);

    const result = await useCase.execute(clientWithAccounts);

    expect(result).not.instanceof(Error);
    expect(result).instanceof(Array);

    const accounts = result as Account[];
    expect(accounts).toHaveLength(2);

    const names = accounts.map((a) => a.name);
    expect(names).toContain('Account 1');
    expect(names).toContain('Account 2');
  });

  test('Should return empty array when client has no accounts', async () => {
    const { useCase, userRepository } = getData();

    const client = createTestClient('client@test.com', []);
    await userRepository.save(client);

    const result = await useCase.execute(client);

    expect(result).not.instanceof(Error);
    expect(result).instanceof(Array);
    expect(result).toHaveLength(0);
  });

  test('Should return error when user not found', async () => {
    const { useCase } = getData();

    const nonExistentClient = createTestClient('notfound@test.com');

    const result = await useCase.execute(nonExistentClient);

    expect(result).instanceof(Error);
  });

  test('Should return error when user is not a client', async () => {
    const { useCase, userRepository } = getData();

    const director = createTestDirector('director@test.com');
    await userRepository.save(director);

    const result = await useCase.execute(director);

    expect(result).instanceof(Error);
  });

  test('Should return single account when client has one account', async () => {
    const { useCase, userRepository } = getData();

    const client = createTestClient('client@test.com');
    const account = createTestAccount(client, '00000000001', 'Solo Account');

    const clientWithAccount = client.updateClientProps(new ClientProps([account]));
    await userRepository.save(clientWithAccount);

    const result = await useCase.execute(clientWithAccount);

    expect(result).instanceof(Array);
    const accounts = result as Account[];
    expect(accounts).toHaveLength(1);
    expect(accounts[0].name).toBe('Solo Account');
  });
});
