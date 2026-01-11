import { describe, expect, test } from 'vitest';
import { Argon2PasswordService, InMemoryUserRepository } from '@pp-clca-pcm/adapters';
import { AdvisorRegistration } from '@pp-clca-pcm/application';
import { User } from '@pp-clca-pcm/domain';
import { AdvisorProps } from '@pp-clca-pcm/domain';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application';

describe('Advisor Registration ', () => {
  const getData = () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const passwordService = new Argon2PasswordService();
    const useCase = new AdvisorRegistration(
      inMemoryUserRepository,
      passwordService
    );

    return {
      useCase,
      repositories: {
        inMemoryUserRepository
      }
    };
  }

  test('Working Fine', async () => {
    const { useCase } = getData();

    const advisor = await useCase.execute(
      'Jane',
      'Doe',
      'jdoe@yopmail.com',
      'Pas*/-sword123@',
    );

    expect(advisor).instanceof(User)

    if (advisor instanceof User) {
      expect(advisor.advisorProps).instanceof(AdvisorProps);
      expect(advisor.clientProps).toBeUndefined();
      expect(advisor.directorProps).toBeUndefined();
    }
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