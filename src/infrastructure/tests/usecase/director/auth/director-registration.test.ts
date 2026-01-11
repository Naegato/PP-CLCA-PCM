import { describe, expect, test } from 'vitest';
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters/repositories/memory/user';
import { DirectorRegistration } from '@pp-clca-pcm/application/usecases/director/auth/director-registration';
import { User } from '@pp-clca-pcm/domain/entities/user';
import { DirectorProps } from '@pp-clca-pcm/domain/value-objects/user/director';
import { EmailAlreadyExistError } from '@pp-clca-pcm/application/errors/email-already-exist';

describe('Advisor Registration ', () => {
  const getData = () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const useCase = new DirectorRegistration(
      inMemoryUserRepository
    );

    return {
      useCase,
      repositories: {
        inMemoryUserRepository,
      }
    };
  }

  test('Working Fine', async () => {
    const { useCase } = getData();

    const director = await useCase.execute(
      'Jane',
      'Doe',
      'jdoe@yopmail.com',
      'Pas*/-sword123@',
    );

    expect(director).instanceof(User)

    if (director instanceof User) {
      expect(director.directorProps).instanceof(DirectorProps);
      expect(director.advisorProps).toBeUndefined();
      expect(director.clientProps).toBeUndefined();
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