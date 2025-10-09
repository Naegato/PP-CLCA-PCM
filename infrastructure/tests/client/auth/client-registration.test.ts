import { describe, expect, test } from 'vitest';

import { ClientRepositoryInMemory } from '@pp-clca-pcm/adapters/repositories/memory/user/client';
import { AccountRepositoryInMemory } from '@pp-clca-pcm/adapters/repositories/memory/account/account';
import { AccountTypeRepositoryInMemory } from '@pp-clca-pcm/adapters/repositories/memory/account/type';
import { ClientRegistration } from '@pp-clca-pcm/application/usecases/client/auth/client-registration';
import { Client } from '@pp-clca-pcm/domain/entities/user/client';
import { PasswordLengthError } from '@pp-clca-pcm/domain/errors/password-length';
import { PasswordUppercaseError } from '@pp-clca-pcm/domain/errors/password-uppercase';

describe('Client Registration ', () => {
  const getData = () => {
    const inMemoryClientsRepository = new ClientRepositoryInMemory();
    const inMemoryAccountRepository = new AccountRepositoryInMemory();
    const inMemoryAccountTypeRepository = new AccountTypeRepositoryInMemory();

    return {
      useCase: new ClientRegistration(
        inMemoryClientsRepository,
        inMemoryAccountRepository,
        inMemoryAccountTypeRepository
      ),
      repositories: {
        inMemoryClientsRepository,
        inMemoryAccountRepository,
        inMemoryAccountTypeRepository
      }
    };
  }

  test('Working Fine', async () => {
    const {
      useCase,
      repositories: {
        inMemoryAccountRepository,
        inMemoryAccountTypeRepository
      }
    } = getData();

    expect((await inMemoryAccountTypeRepository.all()).length).toBe(0);

    const client = await useCase.execute(
      'John',
      'Doe',
      'jdoe@yopmail.com',
      'Pas*/-sword123@',
    );

    expect(client).instanceof(Client);

    const accounts = await inMemoryAccountRepository.all();

    expect(accounts.length).toBe(1);
    expect((await inMemoryAccountTypeRepository.all()).length).toBe(1);
  });

  test('Password need 8 characters', async () => {
    const { useCase } = getData();

    const client = await useCase.execute(
      'John',
      'Doe',
      'jdoe@yopmail.com',
      'Pas*/-1',
    );

    expect(client).instanceof(PasswordLengthError);
  });

  test('Password need 1 uppercase char', async () => {
    const { useCase } = getData();

    const client = await useCase.execute(
      'John',
      'Doe',
      'jdoe@yopmail.com',
      '123456a@',
    );

    expect(client).instanceof(PasswordUppercaseError);
  });

});