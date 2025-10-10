import { describe, expect, test } from 'vitest';

import { User } from '@pp-clca-pcm/domain/entities/user';
import { ClientProps } from '@pp-clca-pcm/domain/value-objects/user/client';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { AccountRepositoryInMemory } from '@pp-clca-pcm/adapters/repositories/memory/account/account';
import { AccountTypeRepositoryInMemory } from '@pp-clca-pcm/adapters/repositories/memory/account/type';
import { ClientRegistration } from '@pp-clca-pcm/application/usecases/client/auth/client-registration';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';

describe('Client Registration ', () => {
  const getData = () => {
    const inMemoryClientsRepository = new InMemoryUserRepository();
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

    expect(client).instanceof(User);

    if (client instanceof User) {
      expect(client.clientProps).instanceof(ClientProps);
      expect(client.clientProps.accounts.length).toBe(1);
    }

    const accounts = await inMemoryAccountRepository.all();

    expect(accounts.length).toBe(1);
    expect((await inMemoryAccountTypeRepository.all()).length).toBe(1);
  });

  test('Should not register with existing email', async () => {
    const { useCase } = getData();

    const user = await useCase.execute(
      'John',
      'Doe',
      'jdoe@yopmail.com',
      'Pas*/-sword123@',
    );

    const user2 = await useCase.execute(
      'Jane',
      'Doe',
      'jdoe@yopmail.com',
      'Pas*/-sword123@',
    );

    expect(user).instanceof(User);
    expect(user2).toBeInstanceOf(EmailAlreadyExistError);
  });
});