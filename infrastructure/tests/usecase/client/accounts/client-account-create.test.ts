import { describe, test, expect } from 'vitest';
import { ClientRegistration } from '@pp-clca-pcm/application/usecases/client/auth/client-registration';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AccountType, AccountTypeNameEnum } from '@pp-clca-pcm/domain/entities/accounts/type';
import { InMemoryAccountRepository } from '@pp-clca-pcm/adapters/repositories/memory/account/account';
import { InMemoryAccountTypeRepository } from '@pp-clca-pcm/adapters/repositories/memory/account/type';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { ClientAccountCreate } from '@pp-clca-pcm/application/usecases/client/accounts/client-account-create';

describe('Client Account Create Use Case', () => {
  const getData = () => {
    const inMemoryUsersRepository = new InMemoryUserRepository();
    const inMemoryAccountRepository = new InMemoryAccountRepository(inMemoryUsersRepository);
    const inMemoryAccountTypeRepository = new InMemoryAccountTypeRepository();
    const clientRegistration = new ClientRegistration(
      inMemoryUsersRepository,
      inMemoryAccountRepository,
      inMemoryAccountTypeRepository
    )

    return {
      useCases: {
        clientRegistration
      },
      repositories: {
        inMemoryUsersRepository,
        inMemoryAccountRepository,
        inMemoryAccountTypeRepository
      }
    };
  }

  test('Should create an account successfully', async () => {
    const data = getData();

    const client = await data.useCases.clientRegistration.execute(
      'John',
      'Doe',
      'jode@yopmail.com',
      'Pas*/-sword123@',
    );

    expect(client).instanceof(User);

    const defaultAccountType = await data.repositories.inMemoryAccountTypeRepository.getOrSave(AccountTypeNameEnum.DEFAULT, AccountType.create(AccountTypeNameEnum.DEFAULT, 0));

    expect(defaultAccountType).instanceof(AccountType);

    if (client instanceof User) {
      expect(client.clientProps.accounts.length).toBe(1);

      const clientAccountCreate = new ClientAccountCreate(defaultAccountType, data.repositories.inMemoryAccountRepository);
      const newAccount = await clientAccountCreate.execute(client, 'Savings Account');

      const updatedClient = await data.repositories.inMemoryUsersRepository.find(client);

      expect(newAccount).toBeDefined();
      expect(newAccount.name).toBe('Savings Account');
      expect(updatedClient.clientProps.accounts.length).toBe(2);
    }
  });
});