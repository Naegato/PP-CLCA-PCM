import { describe, expect, test } from 'vitest';

import { User } from '@pp-clca-pcm/domain';
import { ClientProps } from '@pp-clca-pcm/domain';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters';
import { InMemoryAccountTypeRepository } from '@pp-clca-pcm/adapters';
import { ClientRegistration } from '@pp-clca-pcm/application';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application';

describe('Client Registration ', () => {
  const getData = () => {
    const inMemoryClientsRepository = new InMemoryUserRepository();
    const inMemoryAccountRepository = new InMemoryAccountRepository(inMemoryClientsRepository);
    const inMemoryAccountTypeRepository = new InMemoryAccountTypeRepository();

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
    expect(user2).instanceof(EmailAlreadyExistError);
  });
});