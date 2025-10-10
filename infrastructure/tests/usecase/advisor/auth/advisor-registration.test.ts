import { describe, expect, test } from 'vitest';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { AdvisorRegistration } from '@pp-clca-pcm/application/usecases/advisor/auth/advisor-registration';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { AdvisorProps } from '@pp-clca-pcm/domain/value-objects/user/advisor';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';

describe('Advisor Registration ', () => {
  const getData = () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const useCase = new AdvisorRegistration(
      inMemoryUserRepository
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
    expect(user2).toBeInstanceOf(EmailAlreadyExistError);
  });
});